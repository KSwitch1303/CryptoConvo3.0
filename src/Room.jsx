import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZegoSuperBoardManager } from "zego-superboard-web";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

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
    // zp.addPlugins({ZegoSuperBoardManager});
    // start the call
    zp.joinRoom({
      preJoinViewConfig: {
        title: `Join ${RoomName}`,
      },
      container: element,
      maxUsers: 100,
      videoResolutionList: [
        ZegoUIKitPrebuilt.VideoResolution_360P,
        ZegoUIKitPrebuilt.VideoResolution_180P,
        ZegoUIKitPrebuilt.VideoResolution_480P,
        ZegoUIKitPrebuilt.VideoResolution_720P,
      ],
      whiteboardConfig: {            
        showAddImageButton: true, 
     },
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
  const { RoomName } = useParams();
  const [rsvpStatus, setRsvpStatus] = useState(false);

  const storePublicKey = async () => {
    const response = await axios.post(
      `${apiUrl}/nft-apply`,
      { channelName: RoomName, publicKey: publicKey?.toString() },
    );
    console.log(response.data);
    if (response.data.status === 200) {
      alert("Applied successfully");
      setRsvpStatus(true);
    }else {
      alert("You have already applied")
      setRsvpStatus(true)
    }
  };
  const checkRSVPStatus = async () => {
    if (publicKey) {
      try {
        const response = await axios.post(
          `${apiUrl}/checkRSVP`,
          { channelName: RoomName, publicKey: publicKey?.toString() },
        );
        console.log(response.data); // log the server response
        if (response.data.status === 200) {
          storePublicKey()
          // setRsvpStatus(true);
        } else {
          alert("You didn't RSVP");
        }
        // setRsvpStatus(true);
      } catch (error) {
        console.error(error);
      }
    };
  };
  useEffect(() => {
    checkRSVPStatus();
  }, [publicKey]);
  return (
    <>
      {/* {applied ? null : (
        <button
          onClick={storePublicKey}
          disabled={isPending && publicKey}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isPending ? "Applying" : "Apply for NFT"}
        </button>
      )} */}
      {!rsvpStatus ? (
        <>
          {}  
          <p>Checking RSVP Staus...</p>
        </>
      ) : <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100vw", height: "90vh" }}
      ></div>}
    </>
  );
}
