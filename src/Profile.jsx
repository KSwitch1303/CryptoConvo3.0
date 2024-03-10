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
  const {userName, setUserName, setImgURL} = useContext(UserContext);

  useEffect(() => {
    if (!publicKey) return;
    checkifprofileExists();
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
        setExists(true);
        await getProfile();
        setIsPending(false);
      } else {
        setIsPending(false);
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
    <div className="min-h-screen bg-gray-900 ">
      {isPending ? <p className="text-white">Loading (make sure wallet is connected)...</p> :
        exists ? (
          <>
            <p className="text-3xl font-extrabold text-white flex flex-col items-center justify-center p-10">Welcome {userName}</p>
            <div className="flex">
              <RoomList />
              <RoomDetail />
            </div>
          </>
        ) : (
          <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
          <CreateProfile />
        </div>
        )}
    </div>
   );
}
 
export default Profile;