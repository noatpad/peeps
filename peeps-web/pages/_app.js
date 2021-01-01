import React, { useState } from 'react';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';

const App = ({ Component, pageProps }) => {
  // If tokens are available in cookies, use that instead of authenticating again
  const [auth, setAuth] = useState(false);

  return (
    <div className="container m-2">
      <Head>
        <title>Hello NextJS</title>
      </Head>
      <Component
        auth={auth}
        setAuth={setAuth}
        {...pageProps}
      />
    </div>
  )
}

export default App;
