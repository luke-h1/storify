import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Nav from '../components/Nav';

const toastStyles: React.CSSProperties = {
  minWidth: '300px',
  maxWidth: '95%',
  padding: '0.5rem 0.8rem',
  fontSize: '1rem',
  marginTop: '5rem',
  background: 'var(--modal-bg)',
  color: 'var(--dark)',
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: toastStyles,
          error: {
            style: { fontWeight: 500 },
          },
        }}
      />
      <Nav {...pageProps} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};
export default App;
