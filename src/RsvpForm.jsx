import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const RsvpForm = () => {
    const [participantKey, setParticipantKey] = useState("");
    const { publicKey } = useWallet();
    const [roomPassword, setRoomPassword] = useState("");
    const { RoomName } = useParams();
    const [isPending, setIsPending] = useState(false);

    const handleSubmit =async (e) => {
        e.preventDefault();
        setIsPending(true);
        let response = await axios.post(
            `${apiUrl}/check-password`,
            { channelName: RoomName, password: roomPassword },
        )
        if (response.data.status === 400) {
            alert("Incorrect password");
            setIsPending(false);
            return;
        }
        response = await axios.post(
            `${apiUrl}/store-key`,
            { publicKey: participantKey, channelName: RoomName },
        );
        console.log(response.data.status);
        if (response.data.status === 400) {
            alert("Already RSVPed");
        }else{
            alert("RSVP submitted successfully");
        }
        console.log("submitted");
        setIsPending(false);
    }

    useEffect(() => {
        if (publicKey) {
            setParticipantKey(publicKey.toBase58());
        }
    },[publicKey])

    return ( 
    <div className="box">
      {/* Hero */}
      <div className="relative h-screen">
        {/* Overlay */}
        <div className="absolute h-full w-full flex overflow-hidden bg-black/60"></div>
        {/* Hero Info */}
        <div className="lg:flex lg:pt-20 flex-col items-center justify-center relative z-10 px-6 md:max-w-[90vw] mx-auto">
          {/* Main */}
          <div className="flex flex-col items-center justify-center pb-8">
            <h1 className="text-4xl md:text-5xl text-white font-bold pt-12 mb-4 text-center animate-fadeIn">
              RSVP
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="text-white md:pt-12 flex flex-col items-center justify-center"
          >
            <input
              type="text"
              placeholder="Connect wallet"
              value={participantKey}
              required
              disabled
              className="bg-transparent border-2 border-white rounded-full w-full md:max-w-[30rem] h-[3rem] md:h-[4rem] px-3 md:px-6 mb-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            />
            <input
              type="text"
              placeholder="Enter Room Password"
              value={roomPassword}
              onChange={(e) => {
                if (/^[A-Za-z0-9!@#$%^&*()]+$/.test(e.target.value) || e.target.value === "") {
                  setRoomPassword(e.target.value);
                }else {
                  alert('Invalid Character');
                }
              }}
              required
              className="bg-transparent border-2 border-white rounded-full w-full md:max-w-[30rem] h-[3rem] md:h-[4rem] px-3 md:px-6 mb-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            />
            { publicKey ? (
                <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 duration-100 ease-out font-bold w-full md:max-w-[30rem] rounded-full py-[5px] md:py-[7px] mt-2 md:mt-4"
                disabled={isPending}
              >
                Submit
              </button>
            ) : <p className="text-red-500">{ isPending ? "Submitting" : "Please Connect Walle"}</p> }
          </form>
          
        </div>
      </div>
    </div>
     );
}
 
export default RsvpForm;