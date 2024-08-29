import { useState } from "react";
import "../styles/WalletInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

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

export default WalletInfo;
