import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Nav from '../components/Nav';
import '../styles/index.scss';
import '../styles/table.scss';
import '../styles/nprogress.scss';

import { setThemeClass, getTheme } from '../utils/theme';

const toastStyles: React.CSSProperties = {
  minWidth: '300px',
  maxWidth: '95%',
  padding: '0.5rem 0.8rem',
  fontSize: '1rem',

  background: 'var(--modal-bg)',
  color: 'var(--dark)',
};

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    function start() {
      NProgress.start();
    }

    function done() {
      NProgress.done();
    }

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', done);
    Router.events.on('routeChangeError', done);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', done);
      Router.events.off('routeChangeError', done);
    };
  }, []);

  useEffect(() => {
    const theme = getTheme();
    setThemeClass(theme);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=devide-width, initial-scale=1" />
      </Head>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: toastStyles,
          error: {
            style: { fontWeight: 500 },
          },
        }}
      />
      <Nav {...pageProps} />
      <Component {...pageProps} />
    </>
  );
};
export default App;
