import React, { useState } from "react";
import './MainMenu.css'; 
import { useWallet } from '../WalletContext'; // Импортируйте хук

function MainMenu() {
  const { setWalletData } = useWallet(); // Получите функцию установки данных о кошельке
  const [walletName, setWalletName] = useState("");
  const [error, setError] = useState(null);

  const handleCreateWallet = async () => {
    try {
        window.location.href = "/show-mnemo";
      } 
    catch (error) {
      console.error("Error creating wallet:", error);
      setError("An error occurred while creating the wallet.");
    }
  };

  return (
    <div className="main-menu">
      <h1>MicroWallet</h1>
      <h2>the only wallet you need</h2>

      <button onClick={handleCreateWallet}>Create Wallet</button>
      <button>Import Wallet</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default MainMenu;
