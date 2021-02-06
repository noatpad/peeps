import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Loading from '@components/Loading';

const Done = ({ forceRefreshLists }) => {
  const router = useRouter();

  // Send user back to main page in 5 seconds (should be ample time for lists to be fully updated)
  useEffect(() => {
    setTimeout(() => {
      forceRefreshLists();
      router.replace('/');
    }, 5000)
  }, []);

  return (
    <main className="flex flex-col justify-center items-center h-screen w-full text-center">
      <h2 className="text-5xl font-bold mb-2">Done!</h2>
      <p className="text-xl italic">Just give it a few seconds to update and I&apos;ll send you back shortly...</p>
      <div className="my-6">
        <Loading size={100}/>
      </div>
      <p className="italic text-gray-500">
        (Editing lists using Twitter&apos;s API takes a bit before it updates<br/>so that&apos;s why we have to wait a tad)
      </p>
      <p className="italic text-gray-500">If for some reason you&apos;re stuck here, here&apos;s a <Link href="/" replace><a className="underline">link</a></Link> to bring you back.</p>
    </main>
  )
}

export default Done;
