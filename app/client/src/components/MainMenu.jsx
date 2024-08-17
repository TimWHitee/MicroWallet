import React, { useState } from "react";
import './MainMenu.css'; 
import { useWallet } from '../WalletContext'; // Импортируйте хук

function MainMenu() {
  const { setWalletData } = useWallet(); // Получите функцию установки данных о кошельке
  const [walletName, setWalletName] = useState("");
  const [error, setError] = useState(null);

  const handleCreateWallet = async () => {
    localStorage.removeItem("walletData"); // Clear existing wallet data
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
        localStorage.setItem("walletData", JSON.stringify(data)); // Сохранение данных в localStorage
        // alert(`Wallet created! Address: ${data.address}`);
        // Перенаправление на страницу с информацией о кошельке
        window.location.href = "/wallet-info";
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
      <h1>MicroWallet</h1>
      <h2>the only wallet you need</h2>

      <button onClick={handleCreateWallet}>Create Wallet</button>
      <button>Import Wallet</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default MainMenu;
