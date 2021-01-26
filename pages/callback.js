import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { completeAuth } from '@web-utils/api';

import Loading from '@components/Loading';

const Callback = () => {
  const [valid, setValid] = useState(true);
  const router = useRouter();

  // This page is used as a callback to complete the authentication process
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('oauth_token');
    const verifier = params.get('oauth_verifier');

    // Go back home if user couldn't log in or somehow got here
    if (!token || !verifier) {
      setValid(false);
      backHome();
      return;
    }

    // Once done, redirect back to the root
    completeAuth(token, verifier)
      .then(_ => router.replace('/'))
      .catch(_ => backHome());
  }, []);

  // Redirect back home after a small pause
  const backHome = () => setTimeout(() => router.replace('/hello'), 1000);

  return (
    <main className="flex flex-col justify-center items-center h-screen w-full text-2xl italic text-center">
      {valid ? (
        <p>Gimme a sec...</p>
      ) : (
        <React.Fragment>
          <p>Redirecting you back home...</p>
          <p className="text-sm text-gray-500">Error or pure curiosity?</p>
        </React.Fragment>
      )}
      <div className="my-6">
        <Loading size={100}/>
      </div>
    </main>
  )
}

export default Callback;
