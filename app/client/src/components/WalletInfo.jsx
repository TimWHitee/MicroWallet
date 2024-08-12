import React, { useEffect, useState } from "react";
import './WalletInfo.css'; // Убедитесь, что файл стилей импортирован
import axios from 'axios';

const WalletInfo = ({ walletData }) => {
    const [isVisible, setIsVisible] = useState(false); // Состояние для управления видимостью полей

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
                        <span className="value">*****</span> {/* Скрываем */}
                    </div>
                    <div className="wallet-detail">
                        <span className="label">Mnemonic:</span>
                        <span className="value">*****</span> {/* Скрываем */}
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
    const [balance, setBalance] = useState({ balance_eth: 0, balance_usd: 0 });
    const [error, setError] = useState(null); // Для обработки ошибок

    useEffect(() => {
        const fetchBalance = async () => {
            if (address) {
                setError(null); // Сбрасываем ошибки перед новым запросом
                try {
                    const address = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
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
            <h2>Баланс:</h2>
            <div className="balance-info">
                <p>ETH: {balance.balance_eth}</p>
                <p>USD: ${balance.balance_usd}</p>
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
