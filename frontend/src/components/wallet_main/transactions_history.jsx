import React, { useEffect, useState } from "react";
import "../styles/WalletInfo.css";
import axios from "axios";

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
        `https://roflstudios.com/api/transactions/${"0x2324b024aAC834CBE050718848AC56f607587dc8"}&${startIndex}`
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

export default TransactionsInfo;
