import React, { useState, useEffect } from 'react';

import Modal from './index';
import Button from '@components/Button';
import ChangeDropdownItem from '@components/ChangeDropdownItem';
import { listSortCompare } from '@web-utils/helpers';

const ApplyChangesModal = ({ show, close, applyChanges, add, del }) => {
  const [disableApplyButton, setDisableApplyButton] = useState(true);
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    if (!show) { return }
    setDisableApplyButton(true);
    setTimeout(() => setDisableApplyButton(false), 1500);
  }, [show]);

  useEffect(() => {
    const changesPerList = add.map(a => ({ id: a.id, name: a.name, additions: a.users }));
    del.forEach(d => {
      const index = changesPerList.findIndex(c => c.id === d.id);
      if (index !== -1) {
        changesPerList[index].deletions = d.users;
      } else {
        changesPerList.push({ id: d.id, name: d.name, deletions: d.users });
      }
    })
    setChanges(changesPerList.sort(listSortCompare));
  }, [add, del]);

  return (
    <Modal show={show} close={close} width="w-3/5">
      <div className="flex flex-col items-center mx-8 my-4 space-y-4">
        <h3 className="text-2xl text-center font-bold">Are you sure you wanna apply these changes?</h3>
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
