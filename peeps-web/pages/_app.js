import React, { useState } from 'react';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';

const App = ({ Component, pageProps }) => {
  // If tokens are available in cookies, use that instead of authenticating again
  const [auth, setAuth] = useState(false);

  return (
    <div className="min-h-screen">
      <Head>
        <title>peeps</title>
      </Head>
      <div className="container mx-auto px-8">
        <Component
          auth={auth}
          setAuth={setAuth}
          {...pageProps}
        />
      </div>
    </div>
  )
}

export default App;
