import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const App = ({ Component, pageProps }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const signIn = () => {
    setAuthenticated(true);
  }

  return (
    <div className="container m-2">
      <Component {...pageProps} signIn={signIn} auth={authenticated}/>
    </div>
  )
}

export default App;
