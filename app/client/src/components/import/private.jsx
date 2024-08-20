import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Mnemonic.css";

export default function PrivateKeyImport() {
  const [privateKey, setPrivateKey] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setPrivateKey(e.target.value);
  };

  const handleImport = async () => {
    const data = { private: privateKey }; // Используем ключ 'private'

    try {
      const response = await fetch("http://localhost:8000/import_wallet/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Сохраняем данные кошелька в локальное хранилище
        localStorage.setItem("walletData", JSON.stringify(result));
        
        // Переходим на страницу информации о кошельке
        navigate("/wallet-info");
      } else {
        console.error("Error importing wallet:", result.detail);
        // Вы можете также установить состояние ошибки для отображения пользователю
      }
    } catch (error) {
      console.error("Error importing wallet:", error);
      // Обрабатываем ошибку, возможно, установить состояние ошибки для информирования пользователя
    }
  };

  return (
    <div className="container">
      <h3>Import with Private Key</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mnemonic-grid">
          <input
            type="text"
            value={privateKey}
            onChange={handleInputChange}
            placeholder="Enter your private key"
            className="mnemonic-input"
          />
        </div>

        <button className="button" onClick={handleImport}>Import wallet</button>
      </form>
    </div>
  );
}
