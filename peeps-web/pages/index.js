import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getUser } from '../utils/api';

const Home = ({ auth }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const router = useRouter();

  // Determine what to do on load
  useEffect(() => {
    if (auth) {   // If authenticated, test the API
      getUser()
        .then(user => {
          console.log(user);
          setUser(user);
          setLoading(false);
        })
    } else {      // Otherwise, redirect to the landing page
      router.replace('/hello')
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Hello NextJS</title>
      </Head>
      <main>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h1>{user.name} (@{user.screen_name})</h1>
            <p>{user.statuses_count} tweets</p>
            <p>{user.followers_count} followers</p>
            <p>Following {user.friends_count}</p>
          </div>
        )}
      </main>
    </React.Fragment>
  )
}

export default Home;
