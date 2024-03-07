import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}
const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { publicKey } = useWallet();
  const [created, setCreated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  let rsvpLink;
  let roomLink;

  useEffect(() => {
    const animateText = () => {
      const text =
        "Empowering seamless conferencing with PoAP cNFTs – turning every call into a rewarding experience";
      let index = 0;
      let timer = setInterval(() => {
        setTypingText(text.slice(0, index));
        index++;
        if (index > text.length) clearInterval(timer);
      }, 50);
    };
    animateText();
  }, []);

  const [typingText, setTypingText] = useState("");

  const submitCode = async (e) => {
    e.preventDefault();
    setIsPending(true);
    let res = await axios.get(
      `${apiUrl}/collection-exists?channelName=${roomName}`,
    );
    if (res.data.collectionExists) {
      alert("A collection with this channel name already exists!");
      setIsPending(false);
      return;
    }
    res = await axios.post(`${apiUrl}/store-password`, {
      channelName: roomName,
      password: roomPassword,
      creator: publicKey?.toString(),
    });
    res = await axios.post(`${apiUrl}/create-db`, {
      channelName: roomName,
    });
    res = await axios.post(`${apiUrl}/store-key`, {
      publicKey: publicKey?.toString(),
      channelName: roomName,
    });
    setIsPending(false);
    setCreated(true);
    // navigate(`/rsvp/${roomName}`);
  };

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
                Crypto Convo
              </h1>
              <p className="text-white text-lg -mt-2 text-center max-w-[90vw]">
                {typingText}
              </p>
            </div>

            {/* Enter Code */}
            {created ? null : (
              <form
                onSubmit={submitCode}
                className="text-white md:pt-12 flex flex-col items-center justify-center"
              >
                <input
                  type="text"
                  placeholder="Enter Room Name"
                  value={roomName}
                  disabled={isPending}
                  onChange={(e) => {
                    if (
                      /^[A-Za-z\s]+$/.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      setRoomName(e.target.value);
                    } else {
                      alert("Only alphabets are allowed");
                    }
                  }}
                  required
                  className="bg-transparent border-2 border-white rounded-full w-full md:max-w-[30rem] h-[3rem] md:h-[4rem] px-3 md:px-6 mb-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Room Password"
                  value={roomPassword}
                  disabled={isPending}
                  onChange={(e) => {
                    if (
                      /^[A-Za-z0-9!@#$%^&*()]+$/.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      setRoomPassword(e.target.value);
                    } else {
                      alert("Invalid Character");
                    }
                  }}
                  required
                  className="bg-transparent border-2 border-white rounded-full w-full md:max-w-[30rem] h-[3rem] md:h-[4rem] px-3 md:px-6 mb-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
                />
                <div>
                  <label>Show Password: </label>
                  <input
                    id="check"
                    type="checkbox"
                    value={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                  />
                </div>
                {publicKey ? (
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-400 duration-100 ease-out font-bold w-full md:max-w-[30rem] rounded-full py-[5px] md:py-[7px] mt-2 md:mt-4"
                    disabled={isPending}
                  >
                    {isPending ? "Creating" : "Create Channel"}
                  </button>
                ) : (
                  <p className="text-red-500">Please Connect Wallet</p>
                )}
              </form>
            )}
            {created && (
              <>
                <p className="text-white text-lg -mt-2 text-center max-w-[90vw]">
                  Your RSVP form Link ==={" "}
                  {(rsvpLink = `${window.location.origin}/rsvp/${roomName}`)}
                </p>
                <button
                  className="bg-white hover:bg-gray-200 font-bold py-[5px] md:py-[7px] mt-2 md:mt-4"
                  onClick={() => {
                    navigator.clipboard.writeText(rsvpLink);
                    alert("copied");
                  }}
                >
                  Copy RSVP Link
                </button>
                <p className="text-white text-lg -mt-2 text-center max-w-[90vw]">
                  your Call Room link ==={" "}
                  {
                    (roomLink = `${window.location.origin}/room/${roomName}?roomID=${randomID(6)}`)
                  }
                </p>
                <button
                  className="bg-white hover:bg-gray-200 font-bold py-[5px] md:py-[7px] mt-2 md:mt-4"
                  onClick={() => {
                    navigator.clipboard.writeText(roomLink);
                    alert("copied");
                  }}
                >
                  Copy Room Link
                </button>
              </>
            )}
          </div>
        </div>
      </div>
   );
}
 
export default CreateRoom;