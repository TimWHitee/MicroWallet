import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import WalletInfo from "./components/WalletInfo";
import ShowMnemo from "./components/ShowMnemo"; // Импортируйте ShowMnemo
import ImportPage from "./components/import/ImportPage";
import Mnemonic from "./components/import/mnemonic";
import PrivateKey from "./components/import/private";
import { WalletProvider } from "./WalletContext"; // Импортируйте контекст

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/wallet-info" element={<WalletInfo />} />
          <Route path="/show-mnemo" element={<ShowMnemo />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/import/mnemonic" element={<Mnemonic />} />
          <Route path="/import/private" element={<PrivateKey />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}
