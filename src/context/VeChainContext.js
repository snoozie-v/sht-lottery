
// src/context/VeChainContext.jsx
import { createContext } from 'react';

export const VeChainContext = createContext({
  error: null,
  setError: () => {},
});
