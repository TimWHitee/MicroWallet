import React, { useEffect, useState } from "react";
import "./WalletInfo.css"; // Убедитесь, что файл стилей импортирован
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";

const WalletInfo = ({ walletData }) => {
  const [isVisible, setIsVisible] = useState(false); // Состояние для управления видимостью полей
  const [isCopied, setIsCopied] = useState(false); // Состояние для отслеживания копирования адреса

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true); // Устанавливаем состояние скопированного адреса
        setTimeout(() => setIsCopied(false), 2000); // Сбрасываем состояние через 2 секунды
      })
      .catch((error) => {
        console.error("Error while copying:", error);
      });
  };
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev); // Переключаем видимость
  };

  if (!walletData) {
    return (
      <div className="wallet-info error">No wallet information available.</div>
    );
  }

  return (
    <div className="wallet-info">
      <h2>Wallet Details</h2>
      <div className="wallet-detail">
        <span className="label">Address:</span>
        <span className="value">
          {walletData.address}
          <FontAwesomeIcon
            icon={isCopied ? faCheck : faCopy}
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              color: isCopied ? "green" : "black",
            }}
            onClick={() => copyToClipboard(walletData.address)}
          />
        </span>
      </div>
      {isVisible && (
        <>
          <div className="wallet-detail">
            <span className="label">Private Key:</span>
            <span className="value">{walletData.private_key}</span>
          </div>
        </>
      )}
      <button className="toggle-button" onClick={toggleVisibility}>
        {isVisible ? "Hide private key" : "Show private key"}
      </button>
    </div>
  );
};

const CheckBalance = ({ address }) => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null); // Для обработки ошибок
  const [isAddingToken, setIsAddingToken] = useState(false); // Состояние для отображения формы добавления токена
  const [newToken, setNewToken] = useState({ name: "", address: "" }); // Состояние для хранения данных нового токена

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        setError(null); // Сбрасываем ошибки перед новым запросом
        try {
          let address = "vitalik.eth"; // FIXME: Временная штука - убрать
          const response = await axios.get(
            `http://localhost:8000/check_balance/${address}`
          );
          setBalance(response.data);
        } catch (error) {
          setError("Ошибка при получении баланса"); // Обработка ошибки
          console.error("Ошибка при получении баланса:", error);
        }
      }
    };

    fetchBalance();
  }, [address]); // Запрашиваем баланс при изменении адреса

  const handleAddToken = async () => {
    try {
      // Сначала читаем существующие токены из JSON файла
      const response = await axios.get("http://localhost:8000/get-tokens/");
      const tokens = response.data;

      // Добавляем новый токен
      tokens.push(newToken);

      // Сохраняем обновленный список токенов обратно в JSON файл
      await axios.post("http://localhost:8000/save-tokens/", tokens);

      // Сброс формы
      setNewToken({ name: "", address: "" });
      setIsAddingToken(false);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при добавлении токена:", error);
    }
  };

  return (
    <div className="check-balance">
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Отображение ошибок */}
      <h2>Balance:</h2>
      <div className="balance-info">
        <p>
          ETH value <br />$ {balance?.balance_usd.toLocaleString()}
        </p>{" "}
        {/* Приведение к строке с разделением тысяч */}
      </div>
      <div className="tokens-info">
        <h3>Tokens:</h3>
        {balance?.tokens && Object.keys(balance.tokens).length > 0 ? (
          <ul>
            {Object.entries(balance.tokens).map(([name, amount]) => (
              <li key={name}>
                {name}: {amount.toLocaleString()}{" "}
                {/* Приведение к строке с разделением тысяч */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <button
        onClick={() => setIsAddingToken(true)}
        className="add-token-button"
      >
        <FontAwesomeIcon icon={faPlus} /> Add Token
      </button>
      {isAddingToken && (
        <div className="add-token-form">
          <input
            type="text"
            placeholder="Token Name"
            value={newToken.name}
            onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Token Address"
            value={newToken.address}
            onChange={(e) =>
              setNewToken({ ...newToken, address: e.target.value })
            }
          />
          <button onClick={handleAddToken}>Save Token</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("walletData");
    if (data) {
      setWalletData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="app">
      <WalletInfo walletData={walletData} />
      {walletData && <CheckBalance address={walletData.address} />}{" "}
      {/* Передаем адрес из walletData */}
    </div>
  );
};

export default App;
