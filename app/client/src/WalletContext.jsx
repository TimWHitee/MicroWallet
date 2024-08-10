import React, { createContext, useContext, useState } from 'react';

// Создаем контекст
const WalletContext = createContext();

// Провайдер контекста
export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState(null);

  return (
    <WalletContext.Provider value={{ walletData, setWalletData }}>
      {children}
    </WalletContext.Provider>
  );
};

// Хук для использования контекста
export const useWallet = () => useContext(WalletContext);
