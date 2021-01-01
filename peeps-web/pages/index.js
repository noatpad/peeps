import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';
import { verify, getLists } from '../utils/api';

const Home = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const cookies = new Cookies();

  // Verify that you can make API calls
  useEffect(() => {
    const tokenInCookie = cookies.get('token') !== undefined && cookies.get('secret') !== undefined;
    if (loading && tokenInCookie) {
      verify()
        .then(_ => setAuth(true))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    } else if (!auth) {
      router.replace('/hello');
    }
  }, [loading]);

  // Get all owned lists when authenticated
  useEffect(() => {
    if (!auth) { return }
    getLists()
      .then(data => console.log(data))
      .catch(err => console.error(err))
  }, [auth])

  return (
    <React.Fragment>
      <main>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>Authenticated!</p>
        )}
      </main>
    </React.Fragment>
  )
}

export default Home;
