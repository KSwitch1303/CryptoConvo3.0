import logo from "../assets/CryptoConvo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState, useContext } from "react";
import * as wallet from "@solana/wallet-adapter-react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [connected, setConnected] = useState(false);
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
    <div className="bg-gray-900 shadow-lg sticky top-0 z-50 ">
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
        <div className="flex items-center text-white">
          <div className="mr-6">
            <WalletMultiButton disabled={disabled} className="text-sm" />
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
      </div>
      <div className="bg-gray-900 shadow-lg h-1 w-full"></div>
    </div>
  );
};

export default Navbar;
