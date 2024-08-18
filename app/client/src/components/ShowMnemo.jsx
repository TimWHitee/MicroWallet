import React, { useState, useEffect } from "react";
import './ShowMnemo.css'; 
import { useWallet } from '../WalletContext';
import { useNavigate } from 'react-router-dom';

function ShowMnemo() {
  const { setWalletData } = useWallet(); // Получаем функцию установки данных о кошельке
  const [error, setError] = useState(null); // Для обработки ошибок
  const [walletData, setWalletDataState] = useState(null); // Для хранения данных кошелька
  const navigate = useNavigate(); // Для перенаправления

  useEffect(() => {
    const createWallet = async () => {
      localStorage.removeItem("walletData"); // Очищаем существующие данные кошелька
      setError(null); // Сбрасываем ошибку

      try {
        const response = await fetch("http://localhost:8000/create_wallet/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words_in_mnemo: 24 }), // Указываем количество слов и имя кошелька
        });

        const data = await response.json(); // Получаем данные из ответа

        if (response.ok) {
          setWalletData(data); // Успешное создание кошелька
          localStorage.setItem("walletData", JSON.stringify(data)); // Сохранение данных в localStorage
          setWalletDataState(data); // Сохраняем весь объект data в состоянии
        } else {
          setError(data.detail); // Обработка ошибки
        }
      } catch (error) {
        console.error("Error creating wallet:", error);
        setError("An error occurred while creating the wallet.");
      }
    };

    createWallet(); // Вызываем функцию создания кошелька при монтировании компонента
  }, [setWalletData]);

  const handleReady = () => {
    navigate("/wallet-info");
  };

  return (
    <div className="show-mnemo">
      <h1>Mnemonic</h1>
      <h2>Remember it!</h2>
      
      {walletData ? (
        <>
          <h3>{walletData.mnemonic.join(' ')}</h3>
          <button onClick={handleReady}>Proceed</button>
        </>
      ) : (
        <p>Generating your wallet, please wait...</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ShowMnemo;
