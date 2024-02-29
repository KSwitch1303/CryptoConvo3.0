import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

const Home = () => {
  const [roomCode, setRoomCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const animateText = () => {
      const text =
        "Empowering seamless conferencing with PoAP Cnfts – turning every call into a rewarding experience";
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
      `https://tokenserver-4u3r.onrender.com/collection-exists?channelName=${roomCode}`,
    );
    if (res.data.collectionExists) {
      alert("A collection with this channel name already exists!");
      setIsPending(false);
      return;
    }

    res = await axios.post("https://tokenserver-4u3r.onrender.com/create-db", {
      channelName: roomCode,
    });
    setIsPending(false);
    navigate(`/room/${roomCode}`);
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
          <form
            onSubmit={submitCode}
            className="text-white md:pt-12 flex flex-col items-center justify-center"
          >
            <input
              type="text"
              placeholder="Enter Room Name"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              required
              className="bg-transparent border-2 border-white rounded-full w-full md:max-w-[30rem] h-[3rem] md:h-[4rem] px-3 md:px-6 mb-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            />
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
        </div>
      </div>
    </div>
  );
};

export default Home;
