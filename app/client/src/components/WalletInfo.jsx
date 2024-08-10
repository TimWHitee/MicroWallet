import React, { useEffect, useState } from "react";

const WalletInfo = () => {
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("walletData");
    if (data) {
      setWalletData(JSON.parse(data));
    }
  }, []);

  if (!walletData) {
    return <p>No wallet information available.</p>;
  }

  return (
    <div>
      <h2>Wallet Details</h2>
      <p>Address: {walletData.address}</p>
      <p>Public Key: {walletData.public_key}</p>
      <p>Private Key: {walletData.private_key}</p>
      <p>Mnemonic: {walletData.mnemonic.join(" ")}</p>
    </div>
  );
};

export default WalletInfo;
