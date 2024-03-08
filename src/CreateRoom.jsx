import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  var maxPos = chars.length,
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
  const apiUrl = process.env.REACT_APP_API_URL;
  let rsvpLink;
  let roomLink;

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
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-white text-center">
          Host a Meeting
        </h2>
      </div>

      <div className="mt-8 w-full sm:w-full md:w-[30rem] lg:max-w-md px-4">
        <div className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          {!created ? (
            <form onSubmit={submitCode}>
              <div>
                <label
                  htmlFor="room-name"
                  className="block text-gray-300 text-sm font-bold mb-2 mt-4"
                >
                  Room Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="room-name"
                    name="room-name"
                    type="text"
                    autoComplete="room-name"
                    value={roomName}
                    disabled={isPending}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-300 text-sm font-bold mb-2 mt-4"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={roomPassword}
                    disabled={isPending}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                {publicKey ? (
                  <button
                    type="submit"
                    className="relative flex items-center justify-center text-white hover:before:bg-purple-500 h-[50px] md:w-60 w-full overflow-hidden border border-gray-700 bg-transparent px-3 text-black-500 shadow-2xl transition-all rounded-md before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-purple-500 before:transition-all before:duration-500 hover:text-white hover:shadow-purple-lg hover:before:left-0 hover:before:w-full"
                    style={{ marginTop: "2rem" }}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V2C5.373 2 2 5.373 2 10h2zm16 0a8 8 0 01-8 8v2c4.627 0 8-3.373 8-8h-2zm-8 8a8 8 0 01-8-8H2c0 4.627 3.373 8 8 8v-2zm8-8a8 8 0 018 8h2c0-4.627-3.373-8-8-8v2z"
                          ></path>
                        </svg>
                        <span className="relative z-10 text-sm md:text-base font-semibold">
                          Creating
                        </span>
                      </>
                    ) : (
                      <span className="relative z-10 text-sm md:text-base font-semibold">
                        Create Channel
                      </span>
                    )}
                  </button>
                ) : (
                  <p className="text-red-500 mt-4 text-center">
                    Please Connect Wallet
                  </p>
                )}
              </div>
            </form>
          ) : (
            <div className="mt-6">
              <p className="text-lg text-gray-400">
                Your RSVP form Link:{" "}
                {(rsvpLink = `${window.location.origin}/rsvp/${roomName}`)}
              </p>
              <button
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  navigator.clipboard.writeText(rsvpLink);
                  alert("copied");
                }}
              >
                Copy RSVP Link
              </button>
              <p className="text-lg text-gray-400 mt-6">
                Your Call Room Link:{" "}
                {
                  (roomLink = `${window.location.origin}/room/${roomName}?roomID=${randomID(
                    6,
                  )}`)
                }
              </p>
              <button
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  navigator.clipboard.writeText(roomLink);
                  alert("copied");
                }}
              >
                Copy Room Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
