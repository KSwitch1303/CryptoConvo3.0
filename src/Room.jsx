import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { UserContext } from "./contexts/UserContext";


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
  const {userName, setDisabled} = useContext(UserContext);
  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1382357486;
    const serverSecret = "179049a1952d2566b5cb016109615389";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      publicKey?.toString(),
      userName ? userName : randomID(6),
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
      onUserAvatarSetter:async (userList) => {
          userList.forEach(async user => {
           let res = await axios.get(`${apiUrl}/get-image-url`, {
             params: {
               key: user.userID
             }
           })
           if (res.data.status === 200) {
             user.setUserAvatar(res.data.img)
           }
          })
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
  const { RoomName } = useParams();
  const [rsvpStatus, setRsvpStatus] = useState(false);
  const checkRoomLink = async () => {
    let url = window.location.href
    try {
      const response = await axios.get(`${apiUrl}/check-roomLink`, {
        params: {
          roomLink: url,
        },
      });
      if (response.data.status === 400) {
        alert("Room does not exist");
        window.location.href = "/";
      }
    } catch (error) {
      alert(error);
    }
  }
  const storePublicKey = async () => {
    const response = await axios.post(`${apiUrl}/nft-apply`, {
      channelName: RoomName,
      publicKey: publicKey?.toString(),
    });
    if (response.data.status === 200) {
      console.log("Applied successfully");
      setRsvpStatus(true);
    } else {
      console.log("You have already applied");
      setRsvpStatus(true);
    }
  };
  const checkRSVPStatus = async () => {
    if (publicKey) {
      try {
        const response = await axios.post(`${apiUrl}/checkRSVP`, {
          channelName: RoomName,
          publicKey: publicKey?.toString(),
        });
        if (response.data.status === 200) {
          storePublicKey();
          // setRsvpStatus(true);
        } else {
          alert("You didn't RSVP");
        }
        // setRsvpStatus(true);
      } catch (error) {
        alert(error);
      }
    }
  };
  useEffect(() => {
    if (publicKey) {
      checkRoomLink();
      checkRSVPStatus();
      setDisabled(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-3xl font-semibold text-gray-600 mb-4">
            Checking RSVP Status...
          </h2>
          <div className="flex items-center">
            <svg
              className="animate-spin h-10 w-10 text-gray-500 mr-2"
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
            <p className="text-lg text-gray-500">Please wait...</p>
          </div>
        </div>
      ) : (
        <div
          className="myCallContainer"
          ref={myMeeting}
          style={{ width: "100vw", height: "90vh" }}
        ></div>
      )}
    </>
  );
}
