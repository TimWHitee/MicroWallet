// src/components/WalletInfo.jsx
import React from "react";

const WalletInfo = ({ walletData }) => {
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
