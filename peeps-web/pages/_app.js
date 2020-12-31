import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import 'tailwindcss/tailwind.css';

const App = ({ Component, pageProps }) => {
  // If tokens are available in cookies, use that instead of authenticating again
  const cookies = new Cookies();
  const [auth, setAuth] = useState(cookies.get('token') !== undefined && cookies.get('secret') !== undefined);

  const signIn = () => { setAuth(true) }

  return (
    <div className="container m-2">
      <Component {...pageProps} signIn={signIn} auth={auth}/>
    </div>
  )
}

export default App;
