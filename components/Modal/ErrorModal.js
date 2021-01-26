import React from 'react';

import Modal from './index';
import Button from '@components/Button';

const ErrorModal = ({ show, close, error }) => {
  const { code, message } = error;

  return (
    <Modal show={show} close={close} width="w-120">
      <div className="space-y-2">
        <h4 className="text-lg sm:text-xl text-center">Something went wrong...</h4>
        <p className="text-center italic">
          Well that wasn&apos;t supposed to happen. Make sure you&apos;re properly connected to the Internet, & perhaps refresh the page.
          <br/>
          If this issue continues to present itself, you can always <a className="underline" href="https://github.com/aCluelessDanny/peeps/issues" target="_blank" rel="noopener noreferrer">submit an issue</a> so I can try figuring out what&apos;s wrong.</p>
        <div className="flex justify-center items-center">
          <Button run={close} small>Go back</Button>
          <Button run={() => window.location.reload()} small warning>Refresh</Button>
        </div>
        <p className="text-xs text-center text-gray-400 italic font-light">Twitter API -&gt; Code {code ?? '?'}: &quot;{message ?? 'Unknown error...'}&quot;</p>
      </div>
    </Modal>
  )
}

export default ErrorModal;
