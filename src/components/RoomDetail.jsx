import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

const apiUrl = process.env.REACT_APP_API_URL;

const RoomDetail = () => {
  const { selectedRoom } = useContext(UserContext);
  const [isPending, setIsPending] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [rsvps, setRSVPs] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (selectedRoom) {
      setIsPending(true);
      getRoomLinks()
      getParticipants()
      getRSVPs()
      setIsPending(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedRoom])

  const getRSVPs = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-rsvps`, {
        params: {
          roomName: selectedRoom
        }
      })
      setRSVPs(response.data.rsvps);
    } catch (error) {
      alert(error);
    }
  }
  const getParticipants = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-participants`, {
        params: {
          roomName: selectedRoom
        }
      })
      setParticipants(response.data.participants);
    } catch (error) {
      alert(error);
    }
  }
  const getRoomLinks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-links`, {
        params: {
          roomName: selectedRoom
        }
      })
      setLinks(response.data.link);
    } catch (error) {
      alert(error);
    }
  }
  return ( 
    <div className="mt-8 w-full sm:w-full md:w-[50rem] lg:max-w-[100rem] lg:max-h-[200rem] px-4">
      <div className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        {isPending ? <p className="text-white">Loading...</p> :(
          <>
            <h2 className="mt-6 text-3xl font-extrabold text-black text-center">Room Name: {selectedRoom}</h2>
            <h3 className="mt-6 text-2xl font-extrabold text-black text-center">Room Details</h3>
            <div>
                <p className="mt-6 text-l font-extrabold text-black">RSVP Link: {links.RSVPlink}</p>
                <p className="mt-6 text-l font-extrabold text-black">Room Link: {links.roomLink}</p>
            </div>
            <h3 className="mt-6 text-2xl font-extrabold text-black text-center">RSVPs</h3>
            {rsvps.map((rsvp) => (
              <div key={rsvp._id}>
                <p className="mt-6 text-l font-extrabold text-black">{rsvp.key}</p>
              </div>
            ))}
            <h3 className="mt-6 text-2xl font-extrabold text-black text-center">Participants</h3>
            {participants.map((participant) => (
              <div key={participant._id}>
                <p className="mt-6 text-l font-extrabold text-black">{participant.key}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
   );
}
 
export default RoomDetail;