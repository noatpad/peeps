import React from 'react';

// TODO: Improve look of footer
// TODO: Implement logo links for Twitter and GitHub
const Footer = () => (
  <footer className="px-4 pt-16 pb-20 mt-10 bg-gray-100 text-center">
    <p>
      <span className="align-middle">Developed with</span>
      <svg className="inline-block align-middle mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={20} width={20}>
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
      <span className="align-middle">by <b>a clueless danny</b></span>
    </p>
    <div className="flex justify-center">
      <p>Twitter link</p>
      <p>GitHub link</p>
    </div>
  </footer>
)

export default Footer;
