import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ Updated for React 18+
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';
import '@fontsource/poppins'; // Optional: Font import

const theme = extendTheme({
  fonts: {
    body: `'Poppins', sans-serif`,
  },
});

const container = document.getElementById('root');
const root = createRoot(container); // ✅ React 18 method
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
