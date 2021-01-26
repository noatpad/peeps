import React from 'react';
import Link from 'next/link';

import Button from '@components/Button';

const Four0Four = () => (
  <main className="flex flex-col justify-center items-center h-screen w-full text-center">
    <h1 className="text-9xl font-bold">404</h1>
    <p className="text-xl">Well now I&apos;m curious on how you got here...</p>
    <p className="text-xl">Let&apos;s get you back on track.</p>
    <Link href="/">
      <a>
        <Button primary>Go back home</Button>
      </a>
    </Link>
  </main>
)

export default Four0Four;
