import { motion } from 'framer-motion';
import React from 'react';

import QnA from '@components/QnA';
import { REPO_URL, TWITTER_URL } from '@web-utils/config';

const questions = [
  {
    q: "What is peeps anyway?",
    a: (
      <div>
        <p>
          <b>Peeps</b> is basically a simple list manager, done through Twitter&apos;s API. It allows you to do manage your lists as normal, just done through a different interface focused on better management.
        </p>
      </div>
    )
  },
  {
    q: "Why use this instead of directly on Twitter?",
    a: (
      <div className="space-y-1">
        <p>
          It isn&apos;t very practical, sadly. It gets tedious real fast as it takes 4 clicks (Lists -&gt; [any list] -&gt; Edit list -&gt; Manage members) just to see who&apos;s in a list, & one more to begin adding members (not to mention the search bar is hidden behind a &quot;Suggested&quot; tab, which I found out rather late).
        </p>
        <p>
          This web app is designed to make it easy to edit your lists and each of their members with ease.
        </p>
      </div>
    )
  },
  {
    q: "Any caveats?",
    a: (
      <div className="space-y-1">
        <p>
          There are a couple drawbacks using a third-party tool besides the official thing. Nothing&apos;s ever perfect and this is no exception:
        </p>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            It <em>can</em> be prone to rate limiting. Unlike doing things directly on Twitter, this uses Twitter&apos;s API to do its thing. This means you can only do so much before Twitter times you out for a bit. Be wary of doing large tasks.
          </li>
          <li>
            It&apos;s a thing made by a clueless human being (me), so there might still be bugs after my testing. I think it&apos;s at a good enough point, but a programmer&apos;s is never over.
          </li>
        </ul>
      </div>
    )
  },
  {
    q: "I can't pin lists here!",
    a: (
      <div className="space-y-1">
        <p>
          For those unaware, the mobile Twitter app allows pinning up to 5 lists for easy access. As of the time I&apos;m writing this, the API doesn&apos;t allow pinning lists (maybe it&apos;s a per-device thing?). If it ever gets added, I&apos;ll implement this here. But for the time being, you&apos;ll have to pin them from the app.
        </p>
      </div>
    )
  },
  {
    q: "Why does it ask for so many permissions?",
    a: (
      <div className="space-y-1">
        <p>
          You might&apos;ve noticed upon authenticating this app, it asks for a <em>ton</em> of permissions (such as tweeting on your behalf or follow accounts for you). This app only reads and edits your lists (as well as grab your following list, which will be elaborated in a bit), but it is currently impossible to only ask for specific permissions, because of how the Twitter API works.
        </p>
        <h4 className="font-bold italic">- Extra question: Why use my following list?</h4>
        <p>
          Twitter&apos;s search endpoint is rather dumb. So to make up for it, the app uses your following list to prioritize them when adding members to lists.
        </p>
      </div>
    )
  },
  {
    q: "I still don't trust this!",
    a: (
      <div className="space-y-1">
        <p>
          I can assure you that this app doesn&apos;t do any shady business in the slightest.
        </p>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Peeps is hosted solely on Vercel and its serverless functionality. Your data is <em>never</em> stored in any server.
          </li>
          <li>
            This site only keeps a single cookie that is used for authentication & nothing more.
          </li>
          <li>
            This app is <a className="underline" href={REPO_URL} target="_blank" rel="noopener noreferrer">completely open-sourced</a>, so you can see every single line of code this app runs on. And if you&apos;re extra curious, <a className="underline" href={`${REPO_URL}/tree/master/pages/api`} target="_blank" rel="noopener noreferrer">this directory</a> has every endpoint the app uses.
          </li>
        </ul>
      </div>
    )
  },
  {
    q: "Why'd you make this?",
    a: (
      <div className="space-y-1">
        <p>
          I simply wanted to have a better way to keep track of my peeps. Lists are a great way for me to stay up to date with different circles, but Twitter&apos;s way of managing them makes it difficult to stay organized. This might be useful for some, so I&apos;m putting it out there.
        </p>
        <p>
          <em>If you want something done, do it yourself</em>, they say.
        </p>
      </div>
    )
  },
  {
    q: "Something else on your mind?",
    a: (
      <div>
        <p>
          If you got something else on your mind or you found a bug, don&apos;t hesitate to submit an issue at the repo on <a className="underline" href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub</a> or shoot a message over on <a className="underline" href={TWITTER_URL} target="_blank" rel="noopener noreferrer">Twitter</a>!
        </p>
      </div>
    )
  }
]

const FAQ = () => (
  <motion.main
    className="py-36 lg:mx-24 xl:mx-36 2xl:mx-48 space-y-4"
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
