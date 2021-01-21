import React, { useState, useEffect } from 'react';
import Modal from './index';

import Button from '../Button';

const DeleteListModal = ({ show, close, listName, handleDeleteList }) => {
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);

  useEffect(() => {
    if (!show) { return }
    setDisableDeleteButton(true);
    setTimeout(() => setDisableDeleteButton(false), 1500);
  }, [show]);

  return (
    <Modal show={show} close={close}>
      <p className="text-center">You sure you wanna delete the list <b>{listName}</b>?</p>
      <div className="flex justify-center items-center">
        <Button run={close} small>No, don&apos;t</Button>
        <Button run={handleDeleteList} loading={disableDeleteButton} warning small>Yes, delete</Button>
      </div>
    </Modal>
  )
}

export default DeleteListModal;
