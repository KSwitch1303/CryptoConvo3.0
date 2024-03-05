import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { promises } from "stream";
const apiUrl = process.env.REACT_APP_API_URL;

const quicknode_rpc =  'https://dry-dawn-rain.solana-mainnet.quiknode.pro/8debd76070395100e5f5f7a1058550b679bb9aec/';
const endpoint = quicknode_rpc;

const Mint = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [channelName, setChannelName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [minted, setMinted] = useState(false);
  const { publicKey, sendTransaction  } = useWallet();

     const { connection } = useConnection();

    // Replace the endpoint with the devnet endpoint
  // const devnetEndpoint = 'https://api.mainnet.solana.com';
   // const connection = new web3.Connection(devnetEndpoint);

  async function sendSol (publicKey, sendTransaction, connection) {
    
    const transaction = new web3.Transaction();
    const recipientPubKey = 'AF8SQGrTpecCXJp6MwdUGhQeF4pWgvas1F3kXCUoAqzB';
    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: 20000000,
    });

    await transaction.add(sendSolInstruction)
    try {

      await sendTransaction(transaction, connection).then((sig) => {
        console.log(sig);
        // get_bal(connection, publicKey)
      });

      mint()
    } catch (error) {
      alert(error);
      
      setIsPending(false);
      return;
    }
    
  }




  const navigate = useNavigate();
  const mint = async () => {
    const response = await axios.post(
      `${apiUrl}/mint`,
      {
        image,
        name,
        symbol,
        description,
        channelName,
      },
    );
    console.log(response.data); // log the server response
    setIsPending(false);
    setMinted(true);
    alert("NFT(s) Minted");
    navigate("/");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsPending(true);
      await sendSol(publicKey, sendTransaction, connection);
      
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-black">
      <div className="p-4 sm:p-8 w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-white bg-opacity-50 p-8 rounded-md shadow-lg space-y-4"
        >
          <input
            id="channelName"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image Link"
            // required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            // required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Symbol"
            // required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            // required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel Name"
            // required
            className="input-style"
          />
          {minted ? null : (
            <button
              className="button-style w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              id="channelName"
              type="submit"
              disabled={isPending || !publicKey}
            > 
              {publicKey ? (isPending ? "Minting..." : "Mint") : "Connect Wallet"}
            </button>
          )}

        </form>
      </div>
    </div>
  );
};

export default Mint;
