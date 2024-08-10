import React from 'react';
import { createRoot } from 'react-dom/client'; // Импортируем createRoot из react-dom/client
import App from './App'; // Импорт вашего основного компонента приложения

const container = document.getElementById('root'); // Находим контейнер
const root = createRoot(container); // Создаем корневой элемент
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); // Рендерим приложение
