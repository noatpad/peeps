import React from 'react';
import Head from 'next/head';
import Modal from 'react-modal';
import { AnimatePresence, motion } from 'framer-motion';
import useRouterScroll from '@web-utils/useRouterScroll';

import 'tailwindcss/tailwind.css';
import '@public/global.css';
import Header from '@components/Header';
import Footer from '@components/Footer';

Modal.setAppElement('#__next');

const routeVariants = {
  initial: { opacity: 0, y: -100 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0 }
}

const App = ({ Component, pageProps, router }) => {
  // TODO: Set <Head> for each page
  // TODO: Responsive design
  // TODO: Optimization with useMemo()
  // TODO: Shorten API requests/responses
  // TODO: Use next-seo for SEO
  useRouterScroll();

  return (
    <div className="relative">
      <Head>
        <title>peeps</title>
      </Head>
      <div className="absolute top-0 left-0 right-0 h-screen bg-gradient-to-b from-blue-200 to-transparent -z-10"/>
      <Header/>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={router.route}
          className="container min-h-screen mx-auto px-8"
          variants={routeVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Component {...pageProps}/>
        </motion.div>
      </AnimatePresence>
      <Footer/>
    </div>
  )
}

export default App;
