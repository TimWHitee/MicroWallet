import { useEffect, useState } from "react";
import "../styles/WalletInfo.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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

export default CheckBalance;
