import React from 'react';
import Modal from 'react-modal';

import Button from './Button';

const DeleteListModal = ({ showDeleteModal, setShowDeleteModal, listName, handleDeleteList }) => (
  <Modal
    isOpen={showDeleteModal}
    parentSelector={() => document.querySelector('#lists')}
    overlayClassName="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black bg-opacity-70"
    className="px-8 py-6 rounded-xl bg-white"
    shouldCloseOnEsc={true}
    shouldCloseOnOverlayClick={true}
    onRequestClose={() => setShowDeleteModal(false)}
  >
    <p className="text-center">You sure you wanna delete the list <b>{listName}</b>?</p>
    <div className="flex justify-center items-center">
      <Button text="No, don't" run={() => setShowDeleteModal(false)} small/>
      <Button text="Yes, delete" run={handleDeleteList} warning small/>
    </div>
  </Modal>
);

export default DeleteListModal;
