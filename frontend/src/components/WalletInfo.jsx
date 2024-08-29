import React, { useEffect, useState } from "react";
import "./WalletInfo.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import QRCode from "qrcode.react";
import Web3 from "web3";

const rpcUrl = "https://cloudflare-eth.com";
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

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
          <button class="save-token-button" onClick={handleAddToken}>
            Save Token
          </button>
        </div>
      )}
    </div>
  );
};

const SendTransaction = ({ privateKey }) => {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState(null);
  const [walletData] = useState(JSON.parse(localStorage.getItem("walletData")));

  const get_gas = async () => {
    try {
      const gasPriceWei = await web3.eth.getGasPrice();
      const gasPriceGwei = web3.utils.fromWei(gasPriceWei, "gwei");
      return parseFloat(gasPriceGwei); // Возвращаем в формате float
    } catch (error) {
      console.error("Error getting gas price:", error);
    }
  };

  const sendTransaction = async () => {
    setIsSending(true);
    setError(null);
    try {
      const weiAmount = web3.utils.toWei(amount, "ether");
      const nonce = await web3.eth.getTransactionCount(
        walletData.address,
        "latest"
      );
      const gasPriceGwei = await get_gas();
      console.log("Gas price in Gwei:", gasPriceGwei);

      // Конвертируем газ в Wei
      const gasPriceWei = web3.utils.toWei(gasPriceGwei.toString(), "gwei");

      const transaction = {
        from: walletData.address,
        to: toAddress,
        value: weiAmount,
        gas: 21000,
        gasPrice: 3000000000, // Используем цену газа в Wei
        nonce: nonce,
        chainId: 1, // ID сети Sepolia
      };

      const signedTransaction = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );

      setTxHash(receipt.transactionHash);
      console.log("Transaction successful with hash:", receipt.transactionHash);
    } catch (error) {
      console.log(error);
      setError("Error sending transaction: " + error.message);
      console.error("Error sending transaction:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendTransaction();
  };

  return (
    <div className="send-transaction">
      <h2>Send Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="toAddress">Recipient Address:</label>
          <input
            type="text"
            id="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (ETH):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.0001"
          />
        </div>
        <button type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
        {txHash && (
          <p>
            Transaction Hash:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {((a) => `${a.slice(0, 5)}...${a.slice(-5)}`)(txHash)}
            </a>
          </p>
        )}
        {error && <p className="error">{error}</p>}
      </form>
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
      {walletData && <SendTransaction privateKey={walletData.private_key} />}
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
