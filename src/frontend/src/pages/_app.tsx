import '../styles/global.css';
import type { AppProps } from 'next/app';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import Nav from '../components/Nav';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
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
      <Component {...pageProps} />
    </>
  );
};
export default App;
