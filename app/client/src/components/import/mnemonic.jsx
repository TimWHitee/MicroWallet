import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Mnemonic.css";
import { Mnemonic } from "ethers";

export default function Mnemonic_() {
  const [mnemonicLength, setMnemonicLength] = useState(12);
  const [mnemonicWords, setMnemonicWords] = useState(Array(12).fill(""));
  const [lastPaste, setLastPaste] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSwitch = () => {
    const newLength = mnemonicLength === 12 ? 24 : 12;
    setMnemonicLength(newLength);
    setMnemonicWords(Array(newLength).fill(""));
    setError(null);
  };

  const validate = (words) => {
    console.log(words);

    const mnemonic_ = words.join(" ").trim();
    const isValid = Mnemonic.isValidMnemonic(mnemonic_);
    console.log(mnemonic_);
    console.log(isValid);

    if (!isValid) {
      return false;
    }
    return true;
  };

  const handleInputChange = (index, value) => {
    const newMnemonicWords = [...mnemonicWords];
    newMnemonicWords[index] = value;
    setMnemonicWords(newMnemonicWords);
    setError(null);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    const words = pastedText.split(/\s+/).slice(0, mnemonicLength);

    if (words.length === mnemonicLength) {
      setMnemonicWords(words);
      setLastPaste(words);
      setError(null);
    } else {
      setError(`Пожалуйста, вставьте ровно ${mnemonicLength} слов.`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      if (lastPaste) {
        setMnemonicWords(Array(mnemonicLength).fill(""));
        setLastPaste(null);
        setError(null);
      }
    }
  };

  const handleImport = async () => {
    const isValidMnemonic = validate(mnemonicWords);

    if (!isValidMnemonic) {
      setError("Mnemonic phrase is invalid! Please try again");
      return;
    }

    const data = { mnemonic: mnemonicWords };
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
        localStorage.setItem("walletData", JSON.stringify(result));
        navigate("/wallet-info");
      } else {
        const errorMessage =
          typeof result.detail === "string"
            ? result.detail
            : "Error getting your wallet. It's apparently troubles with the internet";
        setError(errorMessage);
      }
    } catch (error) {
      setError(
        "Error getting your wallet. It's apparently troubles with the internet"
      );
    }
  };

  return (
    <div className="mnemo-container">
      <h3>Import with Mnemonic phrase</h3>
      <div className="switch-container">
        <span className="switch-label">12</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={mnemonicLength === 24}
            onChange={handleSwitch}
          />
          <span className="slider"></span>
        </label>
        <span className="switch-label">24</span>
      </div>

      <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown}>
        <div className="mnemonic-grid">
          {mnemonicWords.map((word, index) => (
            <input
              key={index}
              type="text"
              value={word}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Word ${index + 1}`}
              className="mnemonic-input"
              onPaste={index === 0 ? handlePaste : null}
            />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="button" onClick={handleImport}>
          Import Wallet
        </button>
      </form>
    </div>
  );
}
