import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import Nav from '../components/Nav';
import Wrapper from '../components/Wrapper';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          error: {
            style: { fontWeight: 500 },
          },
        }}
      >
        {t => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <button onClick={() => toast.dismiss(t.id)} type="button">
                    X
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <Nav {...pageProps} />
      <Wrapper variant="regular">
        <Component {...pageProps} />
      </Wrapper>
    </ChakraProvider>
  );
};
export default App;
