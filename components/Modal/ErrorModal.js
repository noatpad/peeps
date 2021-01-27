import React from 'react';

import Modal from './index';
import Button from '@components/Button';
import { RATE_LIMIT_CODE } from '@web-utils/config';

const ErrorModal = ({ show, close, error }) => {
  const { code, message } = error;

  return (
    <Modal show={show} close={close} width="w-120">
      <div className="space-y-2">
        {code === RATE_LIMIT_CODE ? (
          <React.Fragment>
            <h4 className="text-lg sm:text-xl text-center">Rate limited exceeded!</h4>
            <p className="text-center">
              Unfortunately, when dealing with Twitter&apos;s API, you&apos;re restricted to do up to a number of operations in a given time frame. <em>Once you hit that limit, you have to wait a little bit before you can use it again.</em>
            </p>
            <p className="text-center">
              I&apos;ll later implement a better precaution for this, but for now, it might take up to 10-15 minutes before you can start using the app again.
            </p>
            <p className="text-center">
              If you&apos; were applying changes, you might see that it was only partially done. Pardon the inconvenience.
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h4 className="text-lg sm:text-xl text-center">Something went wrong...</h4>
            <p className="text-center italic">
              Well that wasn&apos;t supposed to happen. Make sure you&apos;re properly connected to the Internet, & perhaps refresh the page.
              <br/>
              If this issue continues to present itself, you can always <a className="underline" href="https://github.com/aCluelessDanny/peeps/issues" target="_blank" rel="noopener noreferrer">submit an issue</a> so I can try figuring out what&apos;s wrong.
            </p>
          </React.Fragment>
        )}
      </div>
      <div className="flex justify-center items-center my-2">
        <Button run={close} small>Go back</Button>
        <Button run={() => window.location.reload()} small warning>Refresh</Button>
      </div>
      <p className="text-xs text-center text-gray-400 italic font-light">
        Twitter API -&gt; Code {code ?? '?'}: &quot;{message ?? 'Unknown error...'}&quot;
      </p>
    </Modal>
  )
}

export default ErrorModal;
