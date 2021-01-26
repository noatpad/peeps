import React from 'react';

import Modal from './index';
import Button from '@components/Button';

const ClearChangesModal = ({ show, close, clearChanges }) => (
  <Modal show={show} close={close}>
    <p className="text-lg sm:text-xl text-center">You sure you wanna clear your changes?</p>
    <div className="flex justify-center items-center">
      <Button run={close} small>No, don&apos;t</Button>
      <Button run={clearChanges} warning small>Yes, clear</Button>
    </div>
  </Modal>
)

export default ClearChangesModal;
