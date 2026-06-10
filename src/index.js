import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app...
reportWebVitals();

// Wannan shi ne sashin Service Worker da zai ba da damar girka App din a waya
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/shafina/service-worker.js')
      .then(reg => console.log('Service Worker registered successfully:', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

