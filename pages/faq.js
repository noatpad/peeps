import { motion } from 'framer-motion';
import React from 'react';

import QnA from '@components/QnA';

const questions = [
  {
    q: "What is peeps anyway?",
    a: (
      <p>Why hello there</p>
    )
  },
  {
    q: "What is peeps anyway?",
    a: (
      <p>Why hello there</p>
    )
  },
  {
    q: "What is peeps anyway?",
    a: (
      <p>Why hello there</p>
    )
  },
]

const FAQ = () => (
  <motion.main
    className="py-36 lg:mx-16 xl:mx-32 2xl:mx-48 space-y-4"
    transition={{ staggerChildren: 0.1 }}
    initial="initial"
    animate="animate"
  >
    <h1 className="text-5xl font-bold text-center">FAQ</h1>
    <div className="space-y-2">
      {questions.map(({ q, a }, i) => (
        <QnA key={i} q={q} a={a}/>
      ))}
    </div>
  </motion.main>
)

export default FAQ;
