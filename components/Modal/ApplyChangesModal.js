import React, { useState, useEffect } from 'react';

import Modal from './index';
import Button from '@components/Button';

const ApplyChangesModal = ({ show, close, applyChanges, add, del }) => {
  const [disableApplyButton, setDisableApplyButton] = useState(true);

  useEffect(() => {
    if (!show) { return }
    setDisableApplyButton(true);
    setTimeout(() => setDisableApplyButton(false), 1500);
  }, [show]);

  return (
    <Modal show={show} close={close}>
      <h3 className="text-3xl text-center font-bold mb-4 mx-4">Are you sure you wanna apply these changes?</h3>
      <ul>
        {add.map(({ id, name, users }) => (
          <li key={id}>Add {users.length} member{users.length !== 1 ? 's' : ''} to the <b>{name}</b> list</li>
        ))}
        {del.map(({ id, name, users }) => (
          <li key={id}>Delete {users.length} member{users.length !== 1 ? 's' : ''} to the <b>{name}</b> list</li>
        ))}
      </ul>
      <div className="flex justify-center items-center">
        <Button run={close} warning small>No</Button>
        <Button run={applyChanges} loading={disableApplyButton} primary small>Yes</Button>
      </div>
    </Modal>
  )
}

export default ApplyChangesModal;
