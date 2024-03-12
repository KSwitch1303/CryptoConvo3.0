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
    getRooms();
  }, [publicKey]);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-rooms`, {
        params: {
          creator: publicKey?.toString(),
        },
      });
      setRooms(response.data.rooms);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="w-1/4 bg-gray-800 p-4 rounded-lg ml-6">
      <div>
        {rooms.map((room) => (
          <div key={room._id} className="mb-2">
            <button
              type="button"
              onClick={() => setSelectedRoom(room.roomName)}
              className="relative flex items-center justify-center text-gray-900 bg-gray-100 border border-gray-900 hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-lg px-4 py-2 inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              style={{ width: "100%", minWidth: "10rem" }}
            >
              <img
                src="https://imgur.com/EcKQtEs.png"
                alt="Room Logo"
                className="w-4 h-4 mr-2 -ml-1"
              />
              {room.roomName}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
