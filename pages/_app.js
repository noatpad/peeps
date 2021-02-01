import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Modal from 'react-modal';
import { AnimatePresence, motion } from 'framer-motion';
import useRouterScroll from '@web-utils/useRouterScroll';

import 'tailwindcss/tailwind.css';
import '@public/global.css';
import Header from '@components/Header';
import Footer from '@components/Footer';

Modal.setAppElement('#__next');

const normalVariants = {
  initial: { opacity: 0, y: -100 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0 }
}

const noChangeVariants = {
  initial: { y: 0 },
  enter: { y: 0 },
  exit: { y: 0 }
}

/* PAGES
- /           -> Main page/app
- /hello      -> Landing page
- /faq        -> Frequently asked questions
- /done       -> Finish applying changes
- /callback   -> Auth callback redirect
- /bye        -> Logout helper page
- /404        -> 404
*/

const App = ({ Component, pageProps, router }) => {
  // TODO: Optimization with React.memo()
  // TODO: Update FAQ
  // TODO: Use next-seo for SEO
  // TODO: Make favicon
  // IDEA: Show API usage to user (in the form of credits)
  // TODO: Run Lighthouse auditing and fix appropriate things
  const [auth, setAuth] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const [lists, setLists] = useState(undefined);
  const [add, setAdd] = useState([]);
  const [del, setDel] = useState([]);
  const [routeVariant, setRouteVariant] = useState(normalVariants);
  useRouterScroll();

  // Make no transition for / -> /hello
  useEffect(() => {
    const handleRouteChange = (url) => {
      setRouteVariant((router.route === '/' && url === '/hello') ? noChangeVariants : normalVariants);
    }
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, []);

  return (
    <div className="relative">
      <Head>
        <title>peeps</title>
      </Head>
      <div className="absolute top-0 left-0 right-0 h-screen bg-gradient-to-b from-blue-200 to-transparent -z-10"/>
      <Header auth={auth}/>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={router.route}
          className="container min-h-screen mx-auto px-8"
          variants={routeVariant}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Component
            {...pageProps}
            auth={auth}
            setAuth={setAuth}
            userData={userData}
            setUserData={setUserData}
            lists={lists}
            setLists={setLists}
            add={add}
            setAdd={setAdd}
            del={del}
            setDel={setDel}
          />
        </motion.div>
      </AnimatePresence>
      <Footer/>
    </div>
  )
}

export default App;
