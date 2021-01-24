import React from 'react';
import { startAuth } from '@web-utils/api';

import Title from '@components/Title';
import Button from '@components/Button';

// TODO: Implement and style landing page
const Hello = () => (
  <main className="flex flex-col justify-center items-center h-screen w-full text-center">
    <Title/>
    <Button run={startAuth} primary>Authenticate?</Button>
  </main>
)

export default Hello;
