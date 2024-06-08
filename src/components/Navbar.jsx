import logo from "../assets/CryptoConvo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState, useContext } from "react";
import * as wallet from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [connected, setConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connection } = useConnection();
  const {setUserName, imgURL, setImgURL, disabled} = useContext(UserContext);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      setConnected(true);
      checkifprofileExists();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  const checkifprofileExists = async () => {
    try {
      const response = await axios.get(`${apiUrl}/check-profile`, {
        params: {
          key: publicKey?.toString(),
        }
      });
      if (response.data.status === 200) {
        await getProfile();
      }
    } catch (error) {
      alert(error);
    }
  }
  const getProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-profile`, {
        params: {
          key: publicKey?.toString(),
        }
      });
      setUserName(response.data.profile.username);
      setImgURL(response.data.profile.imageurl);
    } catch (error) {
      alert(error);
    }
  }

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
                  window.location.href = "/";
                }
              }
            />
          </div>
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center text-white">
          <div className="mr-6">
            <WalletMultiButton id="wallet" disabled={disabled} className="text-sm" />
          </div>
          <div className="mr-6">
            {imgURL ? <button disabled={disabled} onClick={() => navigate("/profile")}><img src={imgURL} alt="profile" className="h-10 w-10 rounded-full cursor-pointer hover:scale-125 transition" /></button> : (
              <button disabled={disabled} className="hover:text-purple-400 text-lg font-medium transition" onClick={() => navigate("/profile")}>Create Profile</button>
            )}
          </div>
          {disabled && (
            <button className="border border-gray-500 hover:bg-red-600 hover:text-black text-lg font-medium transition p-2 rounded" onClick={() => window.location.href = "/"}>Leave Call</button>
          )}
          {location.pathname === "/create" ? (
            <button
              onClick={handleButtonClick}
              className="hover:text-purple-400 text-lg font-medium transition ml-6"
              disabled={disabled}
            >
              Mint
            </button>
          ) : (
            <button disabled={disabled} className="hover:text-purple-400 text-lg font-medium transition ml-6" onClick={() => navigate('/create')}>
              Host
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
        <div className="px-4 py-2">
            <WalletMultiButton id="wallet" disabled={disabled} className="text-sm w-full" />
          </div>
          {imgURL ? <button disabled={disabled} onClick={() => navigate("/profile")}><img src={imgURL} alt="profile" className="h-10 w-10 rounded-full cursor-pointer hover:scale-125 transition mx-2 " /></button> : (
              null
            )}
          <button
            className="text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </button>
          
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 flex flex-col text-white items-center">
          
          <div className="px-4 py-2">
            {imgURL ? null: (
              <button disabled={disabled} className="hover:text-purple-400 text-lg font-medium transition w-full text-left" onClick={() => navigate("/profile")}>Create Profile</button>
            )}
          </div>
          {disabled && (
            <div className="px-4 py-2">
              <button className="border border-gray-500 hover:bg-red-600 hover:text-black text-lg font-medium transition p-2 rounded w-full" onClick={() => window.location.href = "/"}>Leave Call</button>
            </div>
          )}
          <div className="px-4 py-2">
            {location.pathname === "/create" ? (
              <button
                onClick={handleButtonClick}
                className="hover:text-purple-400 text-lg font-medium transition w-full text-left"
                disabled={disabled}
              >
                Mint
              </button>
            ) : (
              <button disabled={disabled} className="hover:text-purple-400 text-lg font-medium transition w-full text-left" onClick={() => navigate('/create')}>
                Host
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
