import React, { createContext, useContext } from 'react';

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

export default LenisContext; // Export the context itself for other uses if needed