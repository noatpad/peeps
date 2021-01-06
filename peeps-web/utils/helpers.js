// Custom compare function for sorting lists
export const sortLists = (a, b) => {
  const a_name = a.name.toLowerCase();
  const b_name = b.name.toLowerCase();
  if (a_name < b_name) { return -1 }
  if (a_name > b_name) { return 1 }
  return 0;
}

// Custom compare function for sorting users
export const sortUsers = (a, b) => {
  const a_name = a.screen_name.toLowerCase();
  const b_name = b.screen_name.toLowerCase();
  if (a_name < b_name) { return -1 }
  if (a_name > b_name) { return 1 }
  return 0;
}
