import React, { useState, useEffect } from 'react';

import Button from '@components/Button';
import ChangeDropdownItem from '@components/ChangeDropdownItem';
import Modal from './index';

const ApplyChangesModal = ({ show, close, applyChanges, changes }) => {
  const [disableApplyButton, setDisableApplyButton] = useState(true);

  // Delay confirmation for apply changes button
  useEffect(() => {
    if (!show) { return }
    setDisableApplyButton(true);
    setTimeout(() => setDisableApplyButton(false), 1500);
  }, [show]);

  return (
    <Modal show={show} close={close}>
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg sm:text-xl text-center font-bold">Are you sure you wanna apply these changes?</h3>
        <div className="container space-y-3">
          {changes.map(c => (
            <ChangeDropdownItem key={c.id} item={c}/>
          ))}
        </div>
        <div className="flex justify-center items-center">
          <Button run={close} warning small>No</Button>
          <Button run={applyChanges} loading={disableApplyButton} primary small>Yes</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ApplyChangesModal;
