import { useEffect, useRef } from 'react';

// Custom compare function for sorting lists
const listSortCompare = (a, b) => {
  const a_name = a.name.toLowerCase();
  const b_name = b.name.toLowerCase();
  if (a_name < b_name) { return -1 }
  if (a_name > b_name) { return 1 }
  return 0;
}

// Custom compare function for sorting users
const userSortCompare = (a, b) => {
  const a_name = a.screen_name.toLowerCase();
  const b_name = b.screen_name.toLowerCase();
  if (a_name < b_name) { return -1 }
  if (a_name > b_name) { return 1 }
  return 0;
}

// Sort lists by their name in alphabetical order
export const sortLists = (lists) => lists.sort(listSortCompare).map((l, i) => ({ ...l, index: i }))

// Sort users by their Twitter handle in alphabetical order
export const sortUsers = (users) => users.sort(userSortCompare);

// Custom hook to get a `useState`'s previous value in useEffect()
export const usePrevious = (val) => {
  const ref = useRef();
  useEffect(() => ref.current = val);
  return ref.current;
}
