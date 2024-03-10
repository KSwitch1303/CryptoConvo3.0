import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

const Mint = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [channelName, setChannelName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [minted, setMinted] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  async function sendSol(publicKey, sendTransaction, connection, participants) {
    const transaction = new web3.Transaction();
    const recipientPubKey = "AF8SQGrTpecCXJp6MwdUGhQeF4pWgvas1F3kXCUoAqzB";
    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: 20000000 * participants,
    });

    await transaction.add(sendSolInstruction);
    try {
      await sendTransaction(transaction, connection).then((sig) => {
        console.log(sig);
      });

      mint();
    } catch (error) {
      alert(error);
      setIsPending(false);
      return;
    }
  }

  const checkOwner = async () => {
    try {
      const response = await axios.post(`${apiUrl}/ownercheck`, {
        channelName: channelName,
        creator: publicKey?.toString(),
      });
      if (response.data.status === 200) {
        countParticipants();
      } else {
        alert("You are not the owner");
        setIsPending(false);
      }
    } catch (error) {
      alert(error);
    }
  };

  const countParticipants = async () => {
    try {
      let response = await axios.post(`${apiUrl}/countParticipants`, {
        channelName: channelName,
      });
      const participants = Number(response.data.count);
      if (participants === 0) {
        alert("No participants");
        setIsPending(false);
        return;
      }
      response = await axios.post(`${apiUrl}/countRSVPs`, {
        channelName: channelName,
      });
      const rsvps = Number(response.data.count);
      alert(
        `You're about to mint to ${participants} participants with ${rsvps} RSVP(s) \nYou'll pay 0.02 SOL per participant`,
      );
      await sendSol(publicKey, sendTransaction, connection, participants);
    } catch (error) {
      alert(error);
    }
  };

  const mint = async () => {
    await axios.post(`${apiUrl}/mint`, {
      image,
      name,
      symbol,
      description,
      channelName,
    });
    await deleteRoom();
    setIsPending(false);
    setMinted(true);
    alert("NFT(s) Minted");
    navigate("/create");
  };

  const deleteRoom = async () => {
    await axios.post(`${apiUrl}/delete`, {
      channelName: channelName,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsPending(true);
      checkOwner();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-4 sm:p-8 w-full max-w-lg">
        <h2 className=" text-center mt-6 mb-8 text-3xl font-extrabold text-white">
          Time to Mint!!
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-md space-y-4"
        >
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image Link"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight outline outline-offset4 mt-3 focus:border-purple-500"
          />

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-1-purple-500/50 outline outline-offset1 mt-3"
          />
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Symbol"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-1-purple-500/50 outline outline-offset1 mt-3"
          />
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-1-purple-500/50 outline outline-offset1 mt-3"
          />
          <input
            id="channelName"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel Name"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-1-purple-500/50 outline outline-offset1 mt-4"
          />
          {!minted && (
            <button
              className="relative flex items-center justify-center text-white h-[50px] md:w-60 w-full overflow-hidden border border-gray-700 bg-transparent px-3 shadow-md transition-all duration-300 rounded-md before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-purple-500 before:transition-all before:duration-500 hover:text-black hover:bg-purple-500 hover:shadow-lg hover:before:left-0 hover:before:w-full"
              type="submit"
              disabled={isPending || !publicKey}
            >
              {publicKey ? (
                isPending ? (
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
                      Minting...
                    </span>
                  </>
                ) : (
                  <span className="relative z-10 text-sm md:text-base font-semibold">
                    Mint
                  </span>
                )
              ) : (
                <span className="relative z-10 text-sm md:text-base font-semibold">
                  Connect Wallet
                </span>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Mint;
