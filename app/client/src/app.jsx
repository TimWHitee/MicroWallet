// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import WalletInfo from "./components/WalletInfo";

function App() {
  const [walletData, setWalletData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu setWalletData={setWalletData} />} />
        <Route path="/wallet-info" element={<WalletInfo walletData={walletData} />} />
      </Routes>
    </Router>
  );
}

export default App;
