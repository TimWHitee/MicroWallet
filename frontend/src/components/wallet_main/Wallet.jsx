import React, { useEffect, useState } from "react";
import "../styles/WalletInfo.css";
import QRCode from "qrcode.react";

import TransactionsInfo from "./transactions_history.jsx";
import WalletInfo from "./wallet_info.jsx";
import CheckBalance from "./balance.jsx";
import SendTransaction from "./send_transactions.jsx";
import getGasPrice from "./gas_price.jsx";

const Wallet = () => {
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
      {getGasPrice()}
    </div>
  );
};

export default Wallet;
