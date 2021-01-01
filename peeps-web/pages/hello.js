import React from 'react';
import { startAuth } from '../utils/api';

const Hello = () => {
  return (
    <div>
      <h1>Say hi~</h1>
      <button onClick={startAuth}>Authenticate?</button>
    </div>
  )
}

export default Hello;
