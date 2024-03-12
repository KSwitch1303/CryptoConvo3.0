import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Room from "./Room";
import Navbar from "./components/Navbar";
import Mint from "./Mint";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import * as walletAdapter from "@solana/wallet-adapter-wallets";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo, useState } from "react";
import RsvpForm from "./RsvpForm";
import CreateRoom from "./CreateRoom";
import Profile from "./Profile";

import { UserContext } from "./contexts/UserContext";

const quicknode_rpc = process.env.REACT_APP_ENDPOINT;
const endpoint = quicknode_rpc;

function App() {
  const [userName, setUserName] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const wallets = useMemo(
    () => [
      new walletAdapter.PhantomWalletAdapter(),
      new walletAdapter.SolflareWalletAdapter(),
    ],
    [],
  );
  return (
    <UserContext.Provider value={{ userName, setUserName, imgURL, setImgURL, disabled, setDisabled, selectedRoom, setSelectedRoom }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <div>
              {/* Navbar */}
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/room/:RoomName" element={<Room />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/rsvp/:RoomName" element={<RsvpForm />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </UserContext.Provider>
  );
}

export default App;
