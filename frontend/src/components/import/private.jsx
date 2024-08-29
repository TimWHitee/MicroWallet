import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Private.css";

export default function PrivateKeyImport() {
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setPrivateKey(e.target.value);
    setError(null);
  };

  const handleImport = async () => {
    const data = { private: privateKey };

    console.log(data);

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
            : "Invalid private key. Please try again.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error response:", result);
      setError(
        "Error importing wallet. Please check your network connection and try again."
      );
    }
  };

  return (
    <div className="private-container">
      <h3>Import with Private Key</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="private-grid">
          <input
            type="text"
            value={privateKey}
            onChange={handleInputChange}
            placeholder="Enter your private key"
            className="private-input"
          />
        </div>
        {error && <p className="private-error-message">{error}</p>}
        <button className="button" onClick={handleImport}>
          Import wallet
        </button>
      </form>
    </div>
  );
}
