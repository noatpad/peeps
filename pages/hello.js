import React from 'react';
import { startAuth } from '@web-utils/api';

import Title from '@components/Title';
import Button from '@components/Button';

// TODO: Implement and style landing page
const Hello = () => (
  <main className="min-h-screen">
    <Title/>
    <div className="flex justify-center">
      <Button run={startAuth} primary>Authenticate?</Button>
    </div>
  </main>
)

export default Hello;
