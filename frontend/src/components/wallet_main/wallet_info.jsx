import { useState } from "react";
import "../styles/WalletInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import QRCode from "qrcode.react"; // Импортируем QR-код

const WalletInfo = ({ walletData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

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

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    if (e.target.className === "modal-overlay") {
      setIsModalOpen(false);
    }
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

      <div className="button-container">
        <button className="toggle-button" onClick={toggleVisibility}>
          {isVisible ? "Hide private key" : "Show private key"}
        </button>
        <button className="toggle-button" onClick={openModal}>
          Show QR Code
        </button>
      </div>

      {isVisible && (
        <div className="wallet-detail">
          <span className="value">{walletData.private_key}</span>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <QRCode className="QR" value={walletData.address} size={256} />
            <p>Address QR</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
