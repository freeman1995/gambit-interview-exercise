/** Case-insensitive "name contains" filter; returns `items` itself when there's no search. */
export const filterByName = <T extends { name: string }>(items: T[], search: string): T[] => {
  const normalizedSearch = search.trim().toLowerCase();

  return normalizedSearch
    ? items.filter((item) => item.name.toLowerCase().includes(normalizedSearch))
    : items;
};
