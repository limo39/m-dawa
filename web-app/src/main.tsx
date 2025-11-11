import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { initDemoData } from './utils/storage';
import './api'; // Initialize API

// Initialize demo data
initDemoData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
