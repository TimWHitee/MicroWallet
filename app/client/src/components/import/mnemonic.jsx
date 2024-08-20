import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Mnemonic.css";

export default function Mnemonic() {
  const [mnemonicLength, setMnemonicLength] = useState(12);
  const [mnemonicWords, setMnemonicWords] = useState(Array(12).fill(""));
  const [lastPaste, setLastPaste] = useState(null);
  const navigate = useNavigate();

  const handleSwitch = () => {
    const newLength = mnemonicLength === 12 ? 24 : 12;
    setMnemonicLength(newLength);
    setMnemonicWords(Array(newLength).fill(""));
  };

  const handleInputChange = (index, value) => {
    const newMnemonicWords = [...mnemonicWords];
    newMnemonicWords[index] = value;
    setMnemonicWords(newMnemonicWords);
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent default paste behavior
    const pastedText = e.clipboardData.getData("text");
    const words = pastedText.split(" ").slice(0, mnemonicLength);

    if (words.length === mnemonicLength) {
      setMnemonicWords(words);
      setLastPaste(words);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault(); // Prevent default "Ctrl + Z" behavior
      if (lastPaste) {
        setMnemonicWords(Array(mnemonicLength).fill(""));
        setLastPaste(null);
      }
    }
  };

  const handleImport = async () => {
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
        // Save wallet data to localStorage
        localStorage.setItem("walletData", JSON.stringify(result));
        
        // Navigate to wallet info page
        navigate("/wallet-info");
      } else {
        console.error("Error importing wallet:", result.detail);
        // You can also set an error state to display to the user
      }
    } catch (error) {
      console.error("Error importing wallet:", error);
      // Handle the error, maybe set an error state to inform the user
    }
  };

  return (
    <div className="container">
      <h3>Import with Mnemonic Phrase</h3>
      <div className="switch-container">
        <span className="switch-label">12 words</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={mnemonicLength === 24}
            onChange={handleSwitch}
          />
          <span className="slider"></span>
        </label>
        <span className="switch-label">24 words</span>
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

        <button className="button" onClick={handleImport}>Import wallet</button>
      </form>
    </div>
  );
}
