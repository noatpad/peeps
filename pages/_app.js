import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Modal from 'react-modal';
import { NextSeo } from 'next-seo';
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
  // IDEA: When applying too many changes at once, sometimes the member count is outdated or set to 0, perhaps waiting a bit between requests, or doing a "dummy" request after a pause can fix it
  // IDEA: Dark mode?
  // TODO: Optimization with React.memo()
  const [auth, setAuth] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const [lists, setLists] = useState(undefined);
  const [add, setAdd] = useState([]);
  const [del, setDel] = useState([]);
  const routeVariant = useRef(normalVariants);
  useRouterScroll();

  // Make no transition for / -> /hello
  useEffect(() => {
    const handleRouteChange = (url) => {
      routeVariant.current = (router.route === '/' && url === '/hello' && !auth) ? noChangeVariants : normalVariants;
    }
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, []);

  const forceRefreshLists = () => {
    setAuth(false);
    setLists(undefined);
  }

  return (
    <div className="relative">
      <Head>
        <title>peeps</title>
        <link rel="shortcut icon" href="/favicon.png?v=1.0"/>
      </Head>
      <NextSeo
        title="peeps"
        description="A simple web app to organize your Twitter lists"
        canonical="https://peeps.vercel.app"
        openGraph={{
          url: "https://peeps.vercel.app",
          title: "peeps",
          description: "A simple web app to organize your Twitter lists",
          images: [
            {
              url: 'https://peeps.vercel.app/images/twitter_card_logo.png',
              alt: "Peeps logo",
              height: 1533,
              width: 1533
            }
          ]
        }}
        twitter={{
          handle: '@aCluelessDanny',
          site: "https://peeps.vercel.app",
          cardType: "summary"
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-screen bg-gradient-to-b from-blue-200 to-transparent -z-10"/>
      <Header auth={auth}/>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={router.route}
          className="container min-h-screen mx-auto px-8"
          variants={routeVariant.current}
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
            forceRefreshLists={forceRefreshLists}
          />
        </motion.div>
      </AnimatePresence>
      <Footer/>
    </div>
  )
}

export default App;
