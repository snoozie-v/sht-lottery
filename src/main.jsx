// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import './index.css';
import App from './App.jsx';
import { VeChainContextProvider } from './context/VeChainContextProvider';
import ErrorBoundary from './ErrorBoundary';

// Polyfill Buffer globally
window.Buffer = window.Buffer || Buffer;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <VeChainContextProvider>
        <App />
      </VeChainContextProvider>
    </ErrorBoundary>
  </StrictMode>
);
