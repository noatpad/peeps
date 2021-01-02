import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';
import { verify, getLists } from '../utils/api';
import Title from '../components/Title';
import SelectorPane from '../components/SelectorPane';
import ListSelector from '../components/ListSelector';
import Button from '../components/Button';

const Home = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
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
      .then(({ lists }) => setLists(lists))
      .catch(err => console.error(err))
  }, [auth])

  if (loading) {
    return (
      <main className="text-center">
        <Title/>
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main>
      <Title/>
      <div className="flex my-12">
        <SelectorPane title="Your lists" subtitle={`${lists.length} list${lists.length !== 1 ? 's' : ''}`}>
          <ListSelector lists={lists}/>
        </SelectorPane>
        <SelectorPane title="List name" subtitle="# of members">

        </SelectorPane>
      </div>
      <div className="flex justify-center">
        <Button text="Apply"/>
        <Button text="Clear" warning/>
      </div>
    </main>
  )
}

export default Home;
