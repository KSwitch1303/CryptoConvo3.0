import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Mint = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [channelName, setChannelName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [minted, setMinted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsPending(true);
      const response = await axios.post(
        "https://tokenserver-4u3r.onrender.com/mint",
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
            required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Symbol"
            required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="input-style"
          />
          <input
            id="channelName"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel Name"
            required
            className="input-style"
          />
          {minted ? null : (
            <button
              className="button-style w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              id="channelName"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Minting..." : "Mint"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Mint;
