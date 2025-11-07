import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

function SocialDeskApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SocialDesk - AI-Powered Creator OS</title>
        <meta name="description" content="Grow your social media with AI-powered tools for creators" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default SocialDeskApp;
