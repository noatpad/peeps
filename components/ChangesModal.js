import React from 'react';
import Modal from 'react-modal';

import Button from './Button';

const ChangesModal = ({ showModal, closeModal, applyChanges, add, del }) => (
  <Modal
    isOpen={showModal}
    overlayClassName="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black bg-opacity-70"
    className="px-8 py-6 rounded-xl bg-white"
    shouldCloseOnEsc={true}
    shouldCloseOnOverlayClick={true}
    onRequestClose={closeModal}
  >
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
      <Button run={applyChanges} small>Yes</Button>
      <Button run={closeModal} small warning>No</Button>
    </div>
  </Modal>
)

export default ChangesModal;
