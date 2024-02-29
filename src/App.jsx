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
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";

const endpoint = web3.clusterApiUrl("devnet");
const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];

function App() {
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
            </Routes>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
