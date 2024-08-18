import React, { useState, useEffect } from "react";
import './ShowMnemo.css'; 
import { useWallet } from '../WalletContext';
import { useNavigate } from 'react-router-dom';

function ShowMnemo() {
  const { setWalletData } = useWallet();
  const [error, setError] = useState(null);
  const [walletData, setWalletDataState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createWallet = async () => {
      localStorage.removeItem("walletData");
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/create_wallet/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words_in_mnemo: 24 }),
        });

        const data = await response.json();

        if (response.ok) {
          setWalletData(data);
          localStorage.setItem("walletData", JSON.stringify(data));
          setWalletDataState(data);
        } else {
          setError(data.detail);
        }
      } catch (error) {
        console.error("Error creating wallet:", error);
        setError("An error occurred while creating the wallet.");
      }
    };

    createWallet();
  }, [setWalletData]);

  const handleReady = () => {
    navigate("/wallet-info");
  };

  return (
    <div className="show-mnemo">
      <h1>Mnemonic</h1>
      <h2>Remember it!</h2>
      <h3>This is the first and the last time you see your mnemonic phrase, make sure you've saved it!</h3>

      {walletData ? (
        <>
          <div className="mnemonic-list">
            <ul className="mnemonic-column">
              {walletData.mnemonic.slice(0, 12).map((word, index) => (
                <li key={index} className="mnemonic-item">{index + 1}. {word}</li>
              ))}
            </ul>
            <ul className="mnemonic-column">
              {walletData.mnemonic.slice(12).map((word, index) => (
                <li key={index + 12} className="mnemonic-item">{index + 13}. {word}</li>
              ))}
            </ul>
          </div>
          <button onClick={handleReady}>Ready!</button>
        </>
      ) : (
        <p>Generating your wallet, please wait...</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ShowMnemo;
