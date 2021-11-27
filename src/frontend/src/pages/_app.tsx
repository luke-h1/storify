import { ChakraProvider } from '@chakra-ui/react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import '@src/styles/nprogress.scss';
import { useStore } from '../store/store';

const toastStyles: React.CSSProperties = {
  minWidth: '300px',
  maxWidth: '95%',
  padding: '0.5rem 0.8rem',
  fontSize: '1rem',

  background: 'var(--modal-bg)',
  color: 'var(--dark)',
};

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const store = useStore(pageProps?.initialReduxState);

  useEffect(() => {
    function startHandler() {
      NProgress.start();
    }
    function doneHandler() {
      NProgress.done();
    }
    Router.events.on('routeChangeStart', startHandler);
    Router.events.on('routeChangeComplete', doneHandler);
    Router.events.on('routeChangeError', doneHandler);

    return () => {
      Router.events.off('routeChangeStart', startHandler);
      Router.events.off('routeChangeComplete', doneHandler);
      Router.events.off('routeChangeError', doneHandler);
    };
  });

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

      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>
    </ChakraProvider>
  );
};
export default App;
