import { useState } from "react";
import "../styles/WalletInfo.css";
import Web3 from "web3";

const rpcUrl = "https://cloudflare-eth.com";
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

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
        gasPrice: gasPriceWei, // Используем цену газа в Wei
        nonce: nonce,
        chainId: 1,
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

export default SendTransaction;
