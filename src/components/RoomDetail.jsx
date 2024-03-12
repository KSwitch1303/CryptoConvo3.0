import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

const apiUrl = process.env.REACT_APP_API_URL;

const RoomDetail = () => {
  const { selectedRoom } = useContext(UserContext);
  const [isPending, setIsPending] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [rsvps, setRSVPs] = useState([]);
  const [links, setLinks] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedRoom) {
        setIsPending(true);
        await getRoomLinks();
        await getParticipants();
        await getRSVPs();
        setIsPending(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  const getRSVPs = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-rsvps`, {
        params: {
          roomName: selectedRoom,
        },
      });
      setRSVPs(response.data.rsvps);
    } catch (error) {
      alert(error);
    }
  };

  const getParticipants = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-participants`, {
        params: {
          roomName: selectedRoom,
        },
      });
      setParticipants(response.data.participants);
    } catch (error) {
      alert(error);
    }
  };

  const getRoomLinks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-links`, {
        params: {
          roomName: selectedRoom,
        },
      });
      setLinks(response.data.link);
    } catch (error) {
      alert(error);
    }
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="mt-8 w-full sm:w-full md:w-[50rem] lg:max-w-[100rem] lg:max-h-[200rem] px-4 ">
      <div className="bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 shadow-lg shadow-indigo-500/50">
        {isPending ? (
          <div className="flex items-center justify-center text-gray-500">
            <svg
              className="animate-spin h-8 w-8 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V2C5.373 2 2 5.373 2 10h2zm16 0a8 8 0 01-8 8v2c4.627 0 8-3.373 8-8h-2zm-8 8a8 8 0 01-8-8H2c0 4.627 3.373 8 8 8v-2zm8-8a8 8 0 018 8h2c0-4.627-3.373-8-8-8v2z"
              ></path>
            </svg>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <h2 className="mt-6 text-3xl font-extrabold text-white text-center">
              Room Name: {selectedRoom}
            </h2>
            <div className="mt-8 shadow-2xl p-6 rounded-lg">
  <h3 className="text-2xl font-extrabold text-white text-center mb-4">
    Room Details
  </h3>
  <div className="mt-4">
    <p className="text-lg font-bold text-gray-500 mb-3">
      RSVP Link:{" "}
      <span className="relative">
        <span className="text-gray-500">{links.RSVPlink}</span>{" "}
        <button
          className="text-gray-400 ml-2 focus:outline-none"
          onClick={() => copyToClipboard(links.RSVPlink)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </span>
    </p>
    <p className="text-lg font-bold text-gray-500 mb-3 mt-3">
      Room Link:{" "}
      <span className="relative">
        <span className="text-gray-500">{links.roomLink}</span>{" "}
        <button
          className="text-gray-400 ml-2 focus:outline-none"
          onClick={() => copyToClipboard(links.roomLink)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </span>
    </p>
    {copied && (
      <div className="mt-2 text-green-500">
        <p>Copied to clipboard</p>
      </div>
    )}
  </div>
</div>

            <div className="mt-8">
              <h3 className="text-2xl font-extrabold text-white text-center">
                RSVPs
              </h3>
              <div className="mt-4">
                {rsvps.map((rsvp) => (
                  <p
                    key={rsvp._id}
                    className="text-lg font-bold text-gray-300"
                  >
                    {rsvp.key}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold text-white text-center">
                Participants
              </h3>
              <div className="mt-4">
                {participants.map((participant) => (
                  <p
                    key={participant._id}
                    className="text-lg font-bold text-gray-300"
                  >
                    {participant.key}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomDetail;
