import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { startAuth, startDevAuth } from '@web-utils/api';

import Title from '@components/Title';
import Button from '@components/Button';
import { DEV_MODE, TWITTER_URL } from '@web-utils/config';

const dropVariant = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 }
}

const Hello = () => {
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    setLoading(true);
    startAuth()
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleDevAuth = () => {
    setLoading(true);
    startDevAuth()
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  return (
    <main className="min-h-screen">
      <Title/>
      <motion.div
        className="mx-0 sm:mx-6 md:mx-12 xl:mx-24 2xl:mx-36 -mt-12 mb-14 md:mb-28 space-y-14 md:space-y-28"
        transition={{ staggerChildren: 0.15 }}
        initial="initial"
        animate="animate"
      >
        <div>
          <motion.h2 className="text-3xl text-center font-light" variants={dropVariant}>a simple list manager for Twitter</motion.h2>
          <motion.div className="flex justify-center mt-4" variants={dropVariant}>
            <Button run={handleAuth} loading={loading} primary>Log in with Twitter</Button>
            {DEV_MODE && (
              <Button run={handleDevAuth} loading={loading}>Dev login</Button>
            )}
          </motion.div>
          <motion.div className="max-w-xl mx-auto text-sm text-gray-700 text-center" variants={dropVariant}>
            <p>
              <b>A quick note:</b> When you log in, you&apos;ll notice the app will ask for a <em>lot</em> of permissions. This app <b>only</b> reads and writes to lists, as well as read your following list.
            </p>
            <p>
              <Link href="/faq#permissions"><a className="italic underline"><b>See more information here.</b></a></Link>
            </p>
          </motion.div>
        </div>
        <div className="flex flex-col lg:flex-row mt-24 space-y-8 lg:space-y-0 lg:space-x-8 text-lg">
          <motion.div className="lg:flex-1 h-40 bg-blue-400" variants={dropVariant}/>
          <motion.div className="mx-auto lg:w-120 space-y-1" variants={dropVariant}>
            <h3 className="text-3xl font-bold">
              Twitter lists are pretty useful. The problem is making them...
            </h3>
            <p>
              The great thing about lists is that you can curate different timelines without dealing with Twitter&apos;s &quot;algorithms&quot; on your main timeline.
            </p>
            <p>
              <em>The problem is that it can be rather tedious with Twitter&apos;s built-in tools.</em> They&apos;re alright, but we can do better.
            </p>
            <p>
              <b>Peeps</b> is a simple list manager that makes it nice & easy to edit your list collection and the members within them. Free to use and open sourced to see.
            </p>
          </motion.div>
        </div>
        <div className="mt-8 text-lg text-center space-y-1">
          <motion.h3 className="text-3xl font-bold" variants={dropVariant}>Got any questions?</motion.h3>
          <motion.div variants={dropVariant}>
            <p>The <Link href="/faq"><a className="underline">FAQ</a></Link> page should be enough to answer most questions.</p>
            <p>Also feel free to ask me anything at <a className="underline" href={TWITTER_URL} target="_blank" rel="noopener noreferrer">@aCluelessDanny</a>.</p>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}

export default Hello;
