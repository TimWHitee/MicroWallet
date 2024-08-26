import React, { useEffect, useState } from "react";
import "./WalletInfo.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import QRCode from "qrcode.react"; // Импортируйте QRCode

const TransactionsInfo = ({ walletData }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const itemsPerPage = 3;

  const requestTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/transactions/${walletData.address}&${startIndex}`
      );
      const data = response.data;
      setTransactions(data);
      setTotalTransactions(data.length > 0 ? data[0].total : 0);
      console.log(data);
      if (data.length === 0) {
        setError("No transactions found");
      }
    } catch (error) {
      setError("No transactions found");
    } finally {
      setHasFetched(true);
    }
  };

  // Fetch transactions when the component mounts
  useEffect(() => {
    requestTransactions();
  }, []); // Пустой массив зависимостей, чтобы вызвать только один раз при монтировании

  // Fetch transactions when startIndex changes
  useEffect(() => {
    if (hasFetched) {
      requestTransactions();
    }
  }, [startIndex]);

  const handleNextPage = () => {
    if (startIndex + itemsPerPage < totalTransactions) {
      setStartIndex((prevIndex) => prevIndex + itemsPerPage);
    }
  };

  const handlePreviousPage = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal();
    }
  };

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  return (
    <div className="TransactionsContainer">
      {/* Pagination Controls */}
      <h2>Transactions History</h2>
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={startIndex === 0}>
          Previous
        </button>
        <span>
          Page {Math.floor(startIndex / itemsPerPage) + 1} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={startIndex + itemsPerPage >= totalTransactions}
        >
          Next
        </button>
      </div>

      {/* Display Transactions */}
      <div className="transactions-list">
        {hasFetched && transactions.length === 0 && <p>{error}</p>}
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="transaction-item"
              onClick={() => handleTransactionClick(transaction)}
            >
              <p>{transaction.hash}</p>
            </div>
          ))}
      </div>

      {/* Modal for transaction details */}
      {selectedTransaction && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h1>Transaction Details</h1>
            <p>Hash: {selectedTransaction.hash}</p>
            <p>From: {selectedTransaction.from}</p>
            <p>To: {selectedTransaction.to}</p>
            <p>Value: {selectedTransaction.value}</p>
            <p>Gas: {selectedTransaction.gas}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const WalletInfo = ({ walletData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Error while copying:", error);
      });
  };

  if (!walletData) {
    return (
      <div className="wallet-info error">No wallet information available.</div>
    );
  }

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

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
      <button className="toggle-button" onClick={toggleVisibility}>
        {isVisible ? "Hide private key" : "Show private key"}
      </button>
      {isVisible && (
        <div className="wallet-detail">
          <span className="label">Private Key:</span>
          <span className="value">{walletData.private_key}</span>
        </div>
      )}
    </div>
  );
};

const CheckBalance = ({ address }) => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [newToken, setNewToken] = useState({ name: "", address: "" });

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost:8000/check_balance/${address}`
          );
          setBalance(response.data);
        } catch (error) {
          setError("Ошибка при получении баланса");
          console.error("Ошибка при получении баланса:", error);
        }
      }
    };

    fetchBalance();
  }, [address]);

  const handleAddToken = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get-tokens/");
      const tokens = response.data;
      tokens.push(newToken);

      await axios.post("http://localhost:8000/save-tokens/", tokens);

      setNewToken({ name: "", address: "" });
      setIsAddingToken(false);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при добавлении токена:", error);
    }
  };

  return (
    <div className="check-balance">
      {error && <div className="error-message">{error}</div>}
      <h2>Balance:</h2>
      <div className="balance-info">
        <p>
          ETH value <br />$ {balance?.balance_usd.toLocaleString()}
        </p>
      </div>
      <div className="tokens-info">
        <h3>Tokens:</h3>
        {balance?.tokens && Object.keys(balance.tokens).length > 0 ? (
          <ul>
            {Object.entries(balance.tokens).map(([name, amount]) => (
              <li key={name}>
                {name}: {amount.toLocaleString()}
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
          <button class='save-token-button' onClick={handleAddToken}>Save Token</button>
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
    <div className="app-container">
      <div>
        <WalletInfo walletData={walletData} />
        <TransactionsInfo walletData={walletData} />
      </div>
      {walletData && <CheckBalance address={walletData.address} />}
      <div className="qr-code-container">
        {walletData && (
          <QRCode className="QR" value={walletData.address} size={256} />
        )}
        <p>Address QR</p>
      </div>
    </div>
  );
};

export default App;
