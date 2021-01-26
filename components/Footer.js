import React from 'react';
import { REPO_URL, TWITTER_URL } from '@web-utils/config';

import { GitHub, Heart, Twitter } from './Icons';

const Footer = () => (
  <footer className="px-4 pt-16 pb-20 mt-10 bg-gray-100 font-light text-center space-y-6">
    <p>
      <span className="align-middle">developed with</span>
      <span className="text-red-500"><Heart size={20}/></span>
      <span className="align-middle">by <b className="font-bold">a clueless danny</b></span>
    </p>
    <div className="flex justify-center space-x-4">
      <a className="text-twiiter opacity-70 transform transition-all hover:opacity-100 hover:-translate-y-1" href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
        <Twitter size={28}/>
      </a>
      <a className="text-github opacity-70 transform transition-all hover:opacity-100 hover:-translate-y-1" href={REPO_URL} target="_blank" rel="noopener noreferrer">
        <GitHub size={28}/>
      </a>
    </div>
    <p className="text-xs italic text-gray-500">I just want an easier way to manage my lists...</p>
  </footer>
)

export default Footer;
