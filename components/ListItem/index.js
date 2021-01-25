import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import NormalView from './NormalView';
import EditView from './EditView';

const itemVariants = {
  normal: { height: 68, transition: { type: "spring", duration: 0.4 }},
  edit: { height: 322, transition: { type: "spring", duration: 0.4 }}
};

const ListItem = ({ item, active, addCount, delCount, selectList, _handleUpdateList, _handleDeleteModal }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <motion.div
      className={`relative my-6 rounded-md shadow ${active ? 'ring-2 bg-blue-50' : 'bg-white'} overflow-hidden transition-colors`}
      variants={itemVariants}
      initial={false}
      animate={editMode ? 'edit' : 'normal'}
    >
      <AnimatePresence initial={false} exitBeforeEnter>
        {editMode ? (
          <EditView
            key={`${item.id_str}-edit`}
            item={item}
            exitEditMode={() => setEditMode(false)}
            _handleUpdateList={_handleUpdateList}
          />
        ) : (
          <NormalView
            key={`${item.id_str}-normal`}
            item={item}
            addCount={addCount}
            delCount={delCount}
            enterEditMode={() => setEditMode(true)}
            selectList={selectList}
            _handleDeleteModal={_handleDeleteModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )

  // return editMode ? (
  //   <EditView
  //     item={item}
  //     active={active}
  //     exitEditMode={() => setEditMode(false)}
  //     _handleUpdateList={_handleUpdateList}
  //   />
  // ) : (
  //   <NormalView
  //     item={item}
  //     active={active}
  //     addCount={addCount}
  //     delCount={delCount}
  //     enterEditMode={() => setEditMode(true)}
  //     selectList={selectList}
  //     _handleDeleteModal={_handleDeleteModal}
  //   />
  // )
}

export default ListItem;
