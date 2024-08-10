import React, { useEffect, useState } from "react";
import './WalletInfo.css'; // Убедитесь, что файл стилей импортирован

const WalletInfo = () => {
  const [walletData, setWalletData] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // Состояние для управления видимостью полей

  useEffect(() => {
    const data = localStorage.getItem("walletData");
    if (data) {
      setWalletData(JSON.parse(data));
    }
  }, []);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev); // Переключаем видимость
  };

  if (!walletData) {
    return <div className="wallet-info error">No wallet information available.</div>;
  }

  return (
    <div className="wallet-info">
      <h2>Wallet Details</h2>
      <div className="wallet-detail">
        <span className="label">Address:</span>
        <span className="value">{walletData.address}</span>
      </div>
      {isVisible && (
        <>
          <div className="wallet-detail">
            <span className="label">Public Key:</span>
            <span className="value">{walletData.public_key}</span>
          </div>
          <div className="wallet-detail">
            <span className="label">Private Key:</span>
            <span className="value">{walletData.private_key}</span> {/* Заменяем на звездочки */}
          </div>
          <div className="wallet-detail">
            <span className="label">Mnemonic:</span>
            <span className="value">{walletData.mnemonic.join(" ")}</span> {/* Заменяем на звездочки */}
          </div>
        </>
      )}
      <button className="toggle-button" onClick={toggleVisibility}>
        {isVisible ? "Скрыть реквизиты" : "Показать реквизиты"}
      </button>
    </div>
  );
};

export default WalletInfo;
