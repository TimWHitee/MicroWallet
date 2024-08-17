import React, { useEffect, useState } from "react";
import './WalletInfo.css'; // Убедитесь, что файл стилей импортирован
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const WalletInfo = ({ walletData }) => {
    const [isVisible, setIsVisible] = useState(false); // Состояние для управления видимостью полей
    const [isCopied, setIsCopied] = useState(false); // Состояние для отслеживания копирования адреса

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
          setIsCopied(true); // Устанавливаем состояние скопированного адреса
          setTimeout(() => setIsCopied(false), 2000); // Сбрасываем состояние через 2 секунды
      }).catch((error) => {
          console.error("Ошибка при копировании адреса:", error);
      });
  };
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
                <span className="value">
                    {walletData.address}
                    <FontAwesomeIcon 
                        icon={isCopied ? faCheck : faCopy} // Меняем значок в зависимости от состояния
                        style={{ marginLeft: '10px', cursor: 'pointer', color: isCopied ? 'green' : 'black' }} 
                        onClick={() => copyToClipboard(walletData.address)} 
                    />
                </span>
            </div>
            {isVisible && (
                <>
                    <div className="wallet-detail">
                        <span className="label">Public Key:</span>
                        <span className="value">{walletData.public_key}</span>
                    </div>
                    <div className="wallet-detail">
                        <span className="label">Private Key:</span>
                        <span className="value">{walletData.private_key}</span> {/* Скрываем */}
                    </div>
                    <div className="wallet-detail">
                        <span className="label">Mnemonic:</span>
                        <span className="value">{walletData.mnemonic.join(' ')}</span> {/* Скрываем */}
                    </div>
                </>
            )}
            <button className="toggle-button" onClick={toggleVisibility}>
                {isVisible ? "Скрыть реквизиты" : "Показать реквизиты"}
            </button>
        </div>
    );
};

const CheckBalance = ({ address }) => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null); // Для обработки ошибок

  useEffect(() => {
      const fetchBalance = async () => {
          if (address) {
              setError(null); // Сбрасываем ошибки перед новым запросом
              try {
                //   let address = 'vitalik.eth'; // FIXME: Временная штука - убрать 
                  const response = await axios.get(`http://localhost:8000/check_balance/${address}`);
                  setBalance(response.data);
              } catch (error) {
                  setError("Ошибка при получении баланса. Проверьте адрес."); // Обработка ошибки
                  console.error("Ошибка при получении баланса:", error);
              }
          }
      };

      fetchBalance();
  }, [address]); // Запрашиваем баланс при изменении адреса

  return (
      <div className="check-balance">
          {error && <div className="error-message">{error}</div>} {/* Отображение ошибок */}
          <h2>Balance:</h2>
          <div className="balance-info">
              <p>USD: $ {balance?.balance_usd.toLocaleString()}</p> {/* Приведение к строке с разделением тысяч */}
              <p>ETH: {balance?.balance_eth.toLocaleString()}</p> {/* Приведение к строке с разделением тысяч */}
          </div>
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
            {walletData && <CheckBalance address={walletData.address} />} {/* Передаем адрес из walletData */}
        </div>
    );
};

export default App;
