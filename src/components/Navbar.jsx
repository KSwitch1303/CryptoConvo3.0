import logo from "../assets/CryptoConvo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";
import * as wallet from "@solana/wallet-adapter-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [connected, setConnected] = useState(false);

  const handleButtonClick = () => {
    if (location.pathname === "/create") {
      navigate("/mint");
    } else {
      navigate("/create");
    }
  };

  const { publicKey } = wallet.useWallet();

  useEffect(() => {
    if (!publicKey && connected === true) {
      navigate("/");
      window.location.reload();
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      setConnected(true);
    }
  }, [publicKey]);

  return (
    <div className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center">
          <div className="relative">
            <img
              src={logo}
              alt="Crypto Convo"
              className="h-12 w-auto animate-pulse cursor-pointer"
              onClick={() => {
                if (
                  location.pathname === "/create" ||
                  location.pathname === "/mint"
                ) {
                  navigate("/");
                }
              }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center text-white">
          {location.pathname === "/create" ? (
            <button
              onClick={handleButtonClick}
              className="hover:text-purple-400 text-lg font-medium"
            >
              Mint
            </button>
          ) : (
            <button className="hover:text-blue-500 text-lg font-medium">
              <a href="/create">Host</a>
            </button>
          )}
          <div className="ml-4">
            <WalletMultiButton className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
