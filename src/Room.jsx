import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function Room() {
  const roomID = getUrlParams().get("roomID") || randomID(6);

  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1427065858;
    const serverSecret = "ffaf9908b85b463213965172fba9d42e";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      randomID(5),
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      maxUsers: 100,
      sharedLinks: [
        {
          name: "Join link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  const { publicKey } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [applied, setApplied] = useState(false);
  const { RoomName } = useParams();

  const storePublicKey = async () => {
    if (!isPending && publicKey) {
      try {
        setIsPending(true);
        const response = await axios.post(
          "https://tokenserver-4u3r.onrender.com/store-key",
          { publicKey: publicKey?.toString(), channelName: RoomName },
        );
        console.log(response.data); // log the server response
        setIsPending(false);
        setApplied(true);
      } catch (error) {
        alert(error);
        console.error(error);
      }
    }
  };

  return (
    <>
      {applied ? null : (
        <button
          onClick={storePublicKey}
          disabled={isPending && publicKey}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isPending ? "Applying" : "Apply for NFT"}
        </button>
      )}
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100vw", height: "90vh" }}
      ></div>
    </>
  );
}
