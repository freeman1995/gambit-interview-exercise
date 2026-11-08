/** Delay before the name search is applied to the table (and URL). */
export const SEARCH_DEBOUNCE_MS = 300;

/** URL search-param names for table state (column filters use their column id). */
export const URL_PARAMS = {
  search: 'q',
  sort: 'sort',
} as const;

/** Row style for tables whose rows react to clicks. */
export const CLICKABLE_ROW_STYLE = { cursor: 'pointer' } as const;
