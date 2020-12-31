import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { completeAuth } from '../utils/api';

const Callback = ({ signIn }) => {
  const router = useRouter();

  // This page is used as a callback to complete the authentication process
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('oauth_token');
    const verifier = params.get('oauth_verifier');

    // Once done, redirect back to the root
    completeAuth(token, verifier)
      .then(_ => {
        signIn();
        router.replace({ pathname: '/' });
      })
  }, []);

  return (
    <div>
      <h2>Gimme a sec...</h2>
    </div>
  )
}

export default Callback;
