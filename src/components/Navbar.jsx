import logo from "../assets/CryptoConvo.png";
import { useNavigate, useLocation } from "react-router-dom";
// import "./Navbar.css";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = () => {
    if (location.pathname === "/") {
      navigate("/mint");
    } else {
      navigate("/");
    }
  };

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
          <button onClick={handleButtonClick} className="hover:text-blue-500">
            Home
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
