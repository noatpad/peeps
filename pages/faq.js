import React from 'react';
import { motion } from 'framer-motion';

import QnA from '@components/QnA';
import { REPO_URL, TWITTER_URL } from '@web-utils/config';
import ImageAndCaption from '@components/ImageAndCaption';

const questions = [
  {
    q: "What is peeps anyway?",
    a: (
      <div>
        <p>
          <b>Peeps</b> is a simple list manager for Twitter. It allows you to manage your lists as you would normally, but done through a different interface focused on editing your lists with ease.
        </p>
      </div>
    )
  },
  {
    q: "What are Twitter lists and why use them?",
    a: (
      <div className="space-y-1">
        <p>
          In Twitter, you&apos;re able to make <em>&quot;lists&quot;</em>, each with its own members that you define. These lists can be used to curate content in their own separate timelines, with tweets specifically from those members.
        </p>
        <p>
          A good reason to use these is that they&apos;re separate from your main timeline, which is full of Twitter&apos;s algorithm shenanigans. And on mobile, you can pin up to 5 lists, and these can easily access them with a swipe.
        </p>
        <div>
          <ImageAndCaption imageURL="/images/pinned_lists.png" alt="Pinned lists example" width={1125} height={464}/>
        </div>
      </div>
    )
  },
  {
    q: "Why use this instead of directly on Twitter?",
    a: (
      <div className="space-y-1">
        <p>
          It isn&apos;t very practical, unfortunately. While it&apos;s fine for small lists, it gets tedious real fast for larger tasks.
        </p>
        <p>
          It takes 4 clicks <em>(Lists → [any list] → Edit list → Manage members)</em> just to see who&apos;s on a list, & one more to begin adding members (not to mention the search bar is hidden behind a <em>&quot;Suggested&quot;</em> tab).
        </p>
        <p>
          This web app is designed with list management in mind, being able to edit multiple lists of any size freely and easily.
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
            It can be prone to rate limiting. Unlike doing things directly on Twitter, this uses Twitter&apos;s API to do its thing. This means you&apos;re limited to a number of actions in a given time frame. <em>See next question below for more details.</em>
          </li>
          <li>
            It&apos;s a thing made by a clueless human being <em className="text-sm">(me)</em>, so there might still be bugs after my testing. I think it&apos;s at a good enough point to release, but a developer&apos;s job is never over.
          </li>
        </ul>
      </div>
    )
  },
  {
    q: "What are API credits?",
    a: (
      <div className="space-y-1">
        <p>
          When using the Twitter API, we&apos;re subject to its <em><a className="underline" href="https://developer.twitter.com/en/docs/twitter-api/v1/rate-limits" target="_blank" rel="noopener noreferrer">rate limits</a></em>. Some actions can only be done a number of times at a given moment. To help manage this for the user, this app tracks your <em>&quot;API credits&quot;</em> usage as you use them and informs you when it refreshes.
        </p>
        <div>
          <ImageAndCaption imageURL="/images/api_credits.png" alt="API credits usage bars" width={937} height={118}/>
        </div>
      </div>
    )
  },
  {
    q: "I can't pin lists here!",
    a: (
      <div className="space-y-1">
        <p>
          For those unaware, the mobile Twitter app allows you to pin up to 5 lists for easy access. As of the time I&apos;m writing this, the API doesn&apos;t allow pinning lists (maybe it&apos;s a per-device setting?). For the time being, you&apos;ll have to pin them from the app.
        </p>
        <div>
          <ImageAndCaption imageURL="/images/pin_a_list.png" alt="Go to Lists from the sidebar and then press this to pin a list" width={1125} height={832}/>
        </div>
      </div>
    )
  },
  {
    q: "Why does it ask for so many permissions?",
    a: (
      <div className="space-y-1">
        <p>
          You might&apos;ve noticed upon authenticating this app, it asks for a <em>ton</em> of permissions (such as tweeting on your behalf or follow accounts for you). The <em>only</em> thing this app does is sees & edits your lists (as well as grab your following list, which will be elaborated in a bit), but it&apos;s currently impossible to ask for only specific permissions, because of how the API works.
        </p>
        {/* TODO: Add images */}
        <h4 className="font-bold italic">Extra question: Why use my following list?</h4>
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
            This app is <a className="underline" href={REPO_URL} target="_blank" rel="noopener noreferrer">open-sourced</a>, so you can see every single line of code. And if you&apos;re extra curious, <a className="underline" href={`${REPO_URL}/tree/master/pages/api`} target="_blank" rel="noopener noreferrer">this directory</a> has every API endpoint the app uses.
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
          I simply wanted to have a better way to keep track of my peeps. Lists are a great way for me to stay up to date with different circles, but Twitter&apos;s built-in way of managing them makes it difficult to stay organized.
        </p>
        <p>
          It&apos;s somewhat of a personal tool of mine, but this might be useful for others, so I&apos;m putting it out there.
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
  <main className="py-36 lg:mx-24 xl:mx-36 2xl:mx-48">
    <h1 className="text-5xl font-bold text-center mb-12">FAQ</h1>
    <motion.div
      className="space-y-4"
      transition={{ delay: 0.1, staggerChildren: 0.05 }}
      initial="initial"
      animate="animate"
    >
      {questions.map(({ q, a }, i) => (
        <QnA key={i} q={q} a={a}/>
      ))}
    </motion.div>
  </main>
)

export default FAQ;
