import React from 'react';
import Head from 'next/head';
import { startAuth } from '../utils/api';

const Hello = () => {
  return (
    <div>
      <Head>
        <title>Hello NextJS</title>
      </Head>
      <h1>Say hi~</h1>
      <button onClick={startAuth}>Authenticate?</button>
    </div>
  )
}

export default Hello;
