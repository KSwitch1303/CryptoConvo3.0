import logo from "../assets/CryptoConvo.png";
import { useNavigate, useLocation } from "react-router-dom";
// import "./Navbar.css";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";
import * as wallet from "@solana/wallet-adapter-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [connected, setConnected] = useState(false);

  const handleButtonClick = () => {
    if (location.pathname === "/") {
      navigate("/mint");
    } else {
      navigate("/");
    }
  };

  const { publicKey } = wallet.useWallet()

  useEffect(() => {
    if (!publicKey && connected === true) {
      navigate('/')
      window.location.reload();
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      setConnected(true);
    }
  }, [publicKey]);
  
  return (
    <div className="bg-black/90 shadow-lg flex justify-between items-center px-4 md:max-w-[100vw] mx-auto h-[10vh]">
      {/* Left */}
      <div className="flex items-center">
        <div className="relative">
          <img
            src={logo}
            alt="Crypto Convo"
            className="h-12 w-auto animate-pulse"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center text-white text-bo">
        {location.pathname === "/" ? (
          <button onClick={handleButtonClick} className="hover:text-purple-400">
            Mint
          </button>
        ) : (
          <button className="hover:text-blue-500">
            <a href="/">Home</a>
          </button>
        )}
        <div className="ml-4">
          <WalletMultiButton className="text-sm" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
