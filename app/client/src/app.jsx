import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import WalletInfo from './components/WalletInfo';
import ShowMnemo from './components/ShowMnemo'; // Импортируйте ShowMnemo
import { WalletProvider } from './WalletContext'; // Импортируйте контекст

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes> 
          <Route path="/" element={<MainMenu />} /> 
          <Route path="/wallet-info" element={<WalletInfo />} /> 
          <Route path="/show-mnemo" element={<ShowMnemo />} /> {/* Убедитесь, что ShowMnemo импортирован */}
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
