import React from 'react';
import Pagination from 'react-js-pagination';

import { Prev, Next } from './Icons';

const PaginationBar = ({ itemCount, limit, page, setPage }) => (
  itemCount > limit ? (
    <div className="flex-initial flex justify-center items-center mb-4">
      <Pagination
        totalItemsCount={itemCount}
        itemsCountPerPage={limit}
        onChange={(selected) => setPage(selected)}
        activePage={page}
        pageRangeDisplayed={5}
        prevPageText={<Prev size={20}/>}
        nextPageText={<Next size={20}/>}
        innerClass="inline-flex justify-center items-center p-2 rounded-lg shadow"
        itemClass="h-8 w-8 mx-1.5 rounded-lg"
        linkClass="flex justify-center items-center h-full w-full"
        hideFirstLastPages={true}
        activeClass="ring"
        disabledClass="opacity-40"
      />
    </div>
  ) : null
)

export default PaginationBar
