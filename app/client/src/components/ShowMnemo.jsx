import React, { useState, useEffect } from "react";
import "./ShowMnemo.css";
import { useWallet } from "../WalletContext";
import { saveAs } from "file-saver"; // You might need to install the 'file-saver' package
import { useNavigate } from "react-router-dom";

function ShowMnemo() {
  const { setWalletData } = useWallet();
  const [error, setError] = useState(null);
  const [walletData, setWalletDataState] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [userWords, setUserWords] = useState({ 2: "", 7: "", 11: "" });
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const createWallet = async () => {
      localStorage.removeItem("walletData");
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/create_wallet/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words_in_mnemo: 24 }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("walletData", JSON.stringify(data));
          setWalletDataState(data);
        } else {
          setError(data.detail);
        }
      } catch (error) {
        console.error("Error creating wallet:", error);
        setError("An error occurred while creating the wallet.");
      }
    };

    createWallet();
  }, [setWalletData]);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleInputChange = (index, value) => {
    setUserWords({ ...userWords, [index]: value });
  };

  const handleVerify = () => {
    const isCorrect =
      userWords[2].toLowerCase() === walletData.mnemonic[1] &&
      userWords[7].toLowerCase() === walletData.mnemonic[6] &&
      userWords[11].toLowerCase() === walletData.mnemonic[10];

    setIsVerified(isCorrect);
    if (isCorrect) {
      // Добавляем задержку в 1 секунду перед переходом
      setTimeout(() => {
        navigate("/wallet-info");
      }, 1000); // 1000ms = 1 секунда
    } else {
      setError("The words you entered do not match. Please try again.");
    }
  };
  const handleSkip = () => {
    navigate("/wallet-info");
  };
  const handleDownload = () => {
    const mnemonicText = walletData.mnemonic.join(" ");
    const blob = new Blob([mnemonicText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "mnemonic.txt");
  };

  return (
    <div className="show-mnemo">
      <h1>Mnemonic</h1>

      {walletData ? (
        <>
          {!isReady ? (
            <>
              <h2>Remember it!</h2>
              <h3>
                This is the first and the last time you see your mnemonic
                phrase, make sure you've saved it!
              </h3>
              <h4>Download</h4>
              <div className="mnemonic-list">
                <ul className="mnemonic-column">
                  {walletData.mnemonic.slice(0, 12).map((word, index) => (
                    <li key={index} className="mnemonic-item">
                      {index + 1}. {word}
                    </li>
                  ))}
                </ul>
                <ul className="mnemonic-column">
                  {walletData.mnemonic.slice(12).map((word, index) => (
                    <li key={index + 12} className="mnemonic-item">
                      {index + 13}. {word}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={handleReady}>Ready!</button>
              <button className="dev-button" onClick={handleSkip}>
                Skip (only dev mode)
              </button>{" "}
              {/* dev skip button */}
              <button className="download-button" onClick={handleDownload}>
                <img
                  src="https://img.icons8.com/ios-glyphs/30/000000/download--v1.png"
                  alt="Download"
                  className="download-icon"
                />
              </button>
            </>
          ) : (
            <div className="mnemonic-verification">
              <h3>
                Please enter the 2nd, 7th, and 11th words of your mnemonic
                phrase:
              </h3>
              <input
                type="text"
                placeholder="2nd word"
                value={userWords[2]}
                onChange={(e) => handleInputChange(2, e.target.value)}
              />
              <input
                type="text"
                placeholder="7th word"
                value={userWords[7]}
                onChange={(e) => handleInputChange(7, e.target.value)}
              />
              <input
                type="text"
                placeholder="11th word"
                value={userWords[11]}
                onChange={(e) => handleInputChange(11, e.target.value)}
              />
              <button onClick={handleVerify}>Verify</button>
              {isVerified && (
                <p style={{ color: "green" }}>Verification successful!</p>
              )}
              {error && (
                <p>The words you entered do not match. Please try again.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Generating your wallet, please wait...</p>
      )}
    </div>
  );
}

export default ShowMnemo;
