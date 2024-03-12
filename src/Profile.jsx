import CreateProfile from "./components/CreateProfile";
import { useEffect, useState, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { UserContext } from "./contexts/UserContext";
import RoomList from "./components/RoomList";
import RoomDetail from "./components/RoomDetail";

const apiUrl = process.env.REACT_APP_API_URL;

const Profile = () => {
  const { publicKey } = useWallet();
  const [isPending, setIsPending] = useState(true);
  const [exists, setExists] = useState(false);
  const { userName, setUserName, setImgURL } = useContext(UserContext);

  useEffect(() => {
    if (!publicKey) return;
    checkifprofileExists();
  }, [publicKey]);

  const checkifprofileExists = async () => {
    try {
      const response = await axios.get(`${apiUrl}/check-profile`, {
        params: {
          key: publicKey?.toString(),
        },
      });
      if (response.data.status === 200) {
        setExists(true);
        await getProfile();
        setIsPending(false);
      } else {
        setIsPending(false);
      }
    } catch (error) {
      alert(error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-profile`, {
        params: {
          key: publicKey?.toString(),
        },
      });
      setUserName(response.data.profile.username);
      setImgURL(response.data.profile.imageurl);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {isPending ? (
        <div className="flex justify-center items-center h-screen text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-400 mr-2"></div>
          <p>Loading... <span className="text-red-400">(make sure wallet is connected)</span></p>
        </div>
      ) : exists ? (
        <>
        <p className="text-3xl font-extrabold text-white flex flex-col items-center justify-center p-10">Welcome {userName}</p>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded-lg mb-4 md:mb-0 ml-4">
            <div className="flex items-center text-white text-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span className="text-lg items-center">Room List</span>
            </div>
            <RoomList />
          </div>
          <div className="w-full md:w-3/4 p-4">
            <div className="flex items-center text-white mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4v16c0 .737.506 1.365 1.214 1.54l10.28 1.947a1.5 1.5 0 001.506-2.753L8.84 18H21a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="text-lg text-center">Room Details</span>
            </div>
            <RoomDetail />
          </div>
        </div>
        </>
      ) : (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
          <CreateProfile />
        </div>
      )}
    </div>
  );
};

export default Profile;
