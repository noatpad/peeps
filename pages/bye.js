import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { logout } from '@web-utils/api';

import Button from '@components/Button';
import Loading from '@components/Loading';

// FM Variants
const statusVariants = {
  exit: { opacity: 0 },
  enter: { opacity: 1 }
};

const Bye = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(auth);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    logout()
      .then(_ => {
        setComplete(true);
        setAuth(false);
      })
      .catch(err => console.error('Error logging off?', err))
      .finally(() => setLoading(false))
  }, []);

  return (
    <main className="flex justify-center items-center h-screen w-full text-center">
      <AnimatePresence initial={false} exitBeforeEnter>
        {loading ? (
          <motion.div
            key="logoutComplete"
            variants={statusVariants}
            initial="exit"
            animate="enter"
            exit="exit"
          >
            <div className="my-6">
              <Loading size={100}/>
            </div>
            <p className="text-xl italic">Logging you out...</p>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center"
            key="lougoutInvalid"
            variants={statusVariants}
            initial="exit"
            animate="enter"
            exit="exit"
          >
            {complete ? (
              <div>
                <h2 className="text-5xl font-bold mb-2">Done!</h2>
                <p className="text-xl italic">Hope to see you soon~</p>
              </div>
            ) : (
              <div className="italic">
                <h2 className="text-4xl font-bold mb-2">Something happened?</h2>
                <p className="text-lg text-gray-500">Did you never log in or maybe this is my own mistake?</p>
              </div>
            )}
            <Link href="/hello">
              <a className="my-8">
                <Button primary>Go back home</Button>
              </a>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Bye;
