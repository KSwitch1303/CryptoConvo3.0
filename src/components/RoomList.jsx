import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

const apiUrl = process.env.REACT_APP_API_URL;

const RoomList = () => {
  const { publicKey } = useWallet();
  const [rooms, setRooms] = useState([]);
  const { setSelectedRoom } = useContext(UserContext);


  useEffect(() => {
    getRooms()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[publicKey])

  const getRooms = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-rooms`, {
        params: {
          creator: publicKey?.toString(),
        }
      });
      setRooms(response.data.rooms);
    } catch (error) {
      alert(error);
    }
  }
  return ( 
    <div className="mt-8 w-full sm:w-full md:w-[50rem] lg:max-w-[100rem] lg:max-h-[200rem] px-4">
      <div className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h1 className="mt-6 text-3xl font-extrabold text-white text-center">Room List</h1>
        {rooms.map((room) => (
          <div key={room._id}>
            <button onClick={() => setSelectedRoom(room.roomName)}>{room.roomName}</button>
          </div>
        ))}
      </div>
    </div>
   );
}
 
export default RoomList;