import React, { useState } from 'react';
import Head from 'next/head';
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';
import '@public/global.css';

import Header from '@components/Header';
import Footer from '@components/Footer';

Modal.setAppElement('#__next');

const App = ({ Component, pageProps }) => {
  // If tokens are available in cookies, use that instead of authenticating again
  const [auth, setAuth] = useState(false);

  return (
    <div className="relative">
      <Head>
        <title>peeps</title>
      </Head>
      <div className="absolute top-0 left-0 right-0 h-screen bg-gradient-to-b from-blue-200 to-transparent" style={{ zIndex: -10 }}/>
      <Header/>
      <div className="container min-h-screen mx-auto px-8">
        <Component
          auth={auth}
          setAuth={setAuth}
          {...pageProps}
        />
      </div>
      <Footer/>
    </div>
  )
}

export default App;
