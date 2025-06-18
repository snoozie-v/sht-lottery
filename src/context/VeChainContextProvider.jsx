// src/context/VeChainContextProvider.jsx
import { useState, useEffect } from 'react';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { VeChainContext } from './VeChainContext';

export const VeChainContextProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const nodeUrl = import.meta.env.VITE_VECHAIN_NODE_URL || 'https://testnet.vechain.org/';
  const genesis = 'test'; // Explicitly set for testnet

  useEffect(() => {
    // Validate nodeUrl
    if (!nodeUrl.startsWith('https://')) {
      setError('Invalid node URL: Must start with https://');
    }
  }, [nodeUrl]);

  return (
    <DAppKitProvider
      nodeUrl={nodeUrl}
      genesis={genesis}
      usePersistence={true}
      logLevel="DEBUG"
      themeMode="LIGHT"
      requireCertificate={true}
      allowedWallets={['sync2', 'veworld']}
      connectionCertificate={{
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Sign this certificate to connect to SHT Lottery',
        },
      }}
    >
      <VeChainContext.Provider value={{ error, setError }}>
        {children}
      </VeChainContext.Provider>
    </DAppKitProvider>
  );
};
