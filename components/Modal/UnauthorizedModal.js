import React from 'react';
import { useRouter } from 'next/router';

import Modal from './index';
import Button from '@components/Button';

const UnauthorizedModal = ({ show, close, error }) => {
  const router = useRouter();
  const { code, message } = error;

  const handleClose = () => {
    close();
    router.push('/hello');
  }

  return (
    <Modal show={show} close={handleClose} width="w-96">
      <div className="space-y-2">
        <h4 className="text-xl text-center">Unauthorized!</h4>
        <p className="text-center italic">The app no longer has access to your lists, so we&apos;ll need to log you back in again.</p>
        <div className="flex justify-center items-center">
          <Button run={handleClose} small primary>Go to the home page</Button>
        </div>
        <p className="text-xs text-center text-gray-400 italic font-light">Twitter API -&gt; Code {code ?? '?'}: &quot;{message ?? 'Unknown error...'}&quot;</p>
      </div>
    </Modal>
  )
}

export default UnauthorizedModal;
