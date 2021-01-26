import React, { useState, useEffect } from 'react';

import Modal from './index';
import Button from '@components/Button';

const DeleteListModal = ({ show, close, listName, handleDeleteList }) => {
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);

  // Delay confirmation for the delete button
  useEffect(() => {
    if (!show) { return }
    setDisableDeleteButton(true);
    setTimeout(() => setDisableDeleteButton(false), 1500);
  }, [show]);

  return (
    <Modal show={show} close={close}>
      <h4 className="text-lg sm:text-xl text-center">You sure you wanna delete the list <b>{listName}</b>?</h4>
      <div className="flex justify-center items-center">
        <Button run={close} small>No, don&apos;t</Button>
        <Button run={handleDeleteList} loading={disableDeleteButton} warning small>Yes, delete</Button>
      </div>
    </Modal>
  )
}

export default DeleteListModal;
