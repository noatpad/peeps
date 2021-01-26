import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from 'react-js-pagination';

import { Prev, Next } from './Icons';

const wrapperVariants = {
  exit: { opacity: 0, y: "30%", height: 0 },
  enter: { opacity: 1, y: "0%", height: 'auto' }
}

const PaginationBar = ({ itemCount, limit, page, setPage }) => (
  <AnimatePresence>
    {itemCount > limit && (
      <motion.div
        className="flex-initial flex justify-center items-center my-2 md:my-3"
        variants={wrapperVariants}
        initial="exit"
        animate="enter"
        exit="exit"
      >
        <Pagination
          totalItemsCount={itemCount}
          itemsCountPerPage={limit}
          onChange={(selected) => setPage(selected)}
          activePage={page}
          pageRangeDisplayed={5}
          prevPageText={<Prev size={20}/>}
          nextPageText={<Next size={20}/>}
          innerClass="inline-flex justify-center items-center p-2 rounded-lg shadow"
          itemClass="h-6 sm:h-8 w-6 sm:w-8 mx-1.5 rounded-lg"
          linkClass="flex justify-center items-center h-full w-full"
          hideFirstLastPages={true}
          activeClass="ring"
          disabledClass="opacity-40"
        />
      </motion.div>
    )}
  </AnimatePresence>
)

export default PaginationBar
