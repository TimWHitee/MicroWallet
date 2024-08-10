// src/components/MainMenu.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './MainMenu.css'; 

function MainMenu({ setWalletData }) {
  const [walletName, setWalletName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateWallet = async () => {
    setError(null); // Сброс ошибки
    try {
      const response = await fetch("http://localhost:8000/create_wallet/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ words_in_mnemo: 24 }), // Укажите желаемое количество слов
      });

      const data = await response.json();

      if (response.ok) {
        setWalletData(data); // Успешное создание кошелька
        navigate("/wallet-info"); // Перенаправление на страницу информации о кошельке
      } else {
        setError(data.detail); // Обработка ошибки
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      setError("An error occurred while creating the wallet.");
    }
  };

  return (
    <div className="main-menu">
      <h1>Welcome to MicroWallet</h1>
      <input
        type="text"
        placeholder="Enter wallet name"
        value={walletName}
        onChange={(e) => setWalletName(e.target.value)}
      />
      <button onClick={handleCreateWallet}>Create Wallet</button>
      <button>Import Wallet</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default MainMenu;
