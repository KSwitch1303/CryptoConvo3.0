import { Route, Routes} from "react-router-dom";
import Home from "./Home";
import Room from "./Room";
import Navbar from "./components/Navbar";
import Mint from "./Mint";
import * as web3 from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";

import * as walletAdapter from "@solana/wallet-adapter-wallets";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo } from "react";
import RsvpForm from "./RsvpForm";

// const endpoint = web3.clusterApiUrl("devnet");
const quicknode_rpc = process.env.REACT_APP_ENDPOINT
const endpoint = quicknode_rpc
// const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];

function App() {
  const wallets = useMemo(
    () => [
      new walletAdapter.PhantomWalletAdapter(),
      new walletAdapter.SolflareWalletAdapter()
    ],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <div>
            {/* Navbar */}
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/:RoomName" element={<Room />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/rsvp/:RoomName" element={<RsvpForm />} />
            </Routes>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
