/**
 * How a filterable column's value is stored in the URL:
 * - `text`  → a single param:       `?id=res-00`
 * - `multi` → one param per value:  `?provider=AWS&provider=GCP`
 */
export type UrlFilterKind = 'text' | 'multi';

/** Column id → how that column's filter is stored in the URL. */
export type UrlFilterConfig = Record<string, UrlFilterKind>;
