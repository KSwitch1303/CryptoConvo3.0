import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { HiOutlineRefresh } from "react-icons/hi";
const apiUrl = process.env.REACT_APP_API_URL;

const RsvpForm = () => {
  const [participantKey, setParticipantKey] = useState("");
  const { publicKey } = useWallet();
  const [roomPassword, setRoomPassword] = useState("");
  const { RoomName } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    let response = await axios.post(`${apiUrl}/check-password`, {
      channelName: RoomName,
      password: roomPassword,
    });
    if (response.data.status === 400) {
      alert("Incorrect password");
      setIsPending(false);
      return;
    }
    response = await axios.post(`${apiUrl}/store-key`, {
      publicKey: participantKey,
      channelName: RoomName,
    });
    console.log(response.data.status);
    if (response.data.status === 400) {
      alert("Already RSVPed");
    } else {
      alert("RSVP submitted successfully");
    }
    console.log("submitted");
    setIsPending(false);
    navigate("/mint"); // Redirect to the Mint page after RSVP submission
  };

  useEffect(() => {
    if (publicKey) {
      setParticipantKey(publicKey.toBase58());
    }
  }, [publicKey]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-4 sm:p-8 w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-md space-y-4"
        >
          <h2 className="mt-6 mb-8 text-3xl font-extrabold text-white">RSVP</h2>
          <input
            type="text"
            placeholder="Connect wallet"
            value={participantKey}
            required
            disabled
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-purple-500 mt-3"
          />
          <div className="relative w-full">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-purple-500 mt-3"
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <HiEyeOff className="h-6 w-6 text-gray-400 mt-3" />
              ) : (
                <HiEye className="h-6 w-6 text-gray-400 mt-3" />
              )}
            </div>
          </div>
          <button
            className="relative flex items-center justify-center text-white h-[50px] md:w-60 w-full overflow-hidden border border-gray-700 bg-transparent px-3 shadow-md transition-all duration-300 rounded-md before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-purple-500 before:transition-all before:duration-500 hover:text-black hover:bg-purple-500 hover:shadow-lg hover:before:left-0 hover:before:w-full"
            type="submit"
            disabled={!publicKey || isPending}
          >
            {isPending ? (
              <>
                <HiOutlineRefresh className="animate-spin h-5 w-5 mr-3 text-white" />
                <span className="relative z-10 text-sm md:text-base font-semibold">
                  Submitting...
                </span>
              </>
            ) : (
              <span className="relative z-10 text-sm md:text-base font-semibold">
                Submit
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RsvpForm;
