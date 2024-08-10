import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Измените здесь
import MainMenu from './components/MainMenu';
import WalletInfo from './components/WalletInfo'; // создайте этот компонент
import { WalletProvider } from './WalletContext'; // Импортируйте контекст

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes> {/* Замените Switch на Routes */}
          <Route path="/" element={<MainMenu />} /> {/* Используйте element вместо component */}
          <Route path="/wallet-info" element={<WalletInfo />} /> {/* Используйте element вместо component */}
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
