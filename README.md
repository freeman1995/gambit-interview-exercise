# Gambit – Cloud Resources & Applications

A small client-side UI for browsing an organization's cloud resources (buckets, databases, compute,
IAM roles, …), grouping a selection of them into a named **Application** (e.g. "Payments API"), and
exploring the Applications you created.

There is no backend:

- **Resources** are static data in [`src/data/resources.ts`](src/data/resources.ts).
- **Applications** are saved in the browser's `localStorage` under the `gambit.applications` key.
  They persist across reloads and stay in sync between tabs.

## Features

### Resources page (`/resources`)

- A table of all resources with resizable columns.
- **Search** by name, debounced.
- **Filters** for every other column, opened from the filter icon in each column header. Selected
  values look like the table's own badges.
- **Sorting** on every column. Environment and criticality sort by rank, not alphabetically.
- A **filters panel** above the table holds the search and lists every active filter. Each value can
  be removed on its own, or "Clear all" removes everything.
- **State in the URL**: search, filters and sorting live in the query string, so a view can be
  refreshed, bookmarked or shared. For example:
  `/resources?q=payments&provider=AWS&provider=GCP&sort=criticality:desc`
- **Selection**: click rows to select resources (shift-click selects a range). A sticky footer lists
  the selection and has a **Create Application** button. The button opens a form with a name
  (required) and an optional description.

### Applications page (`/applications`)

- A table of the created Applications, with the same search, filters, sorting and URL state.
- Click an Application to open a **graph** with the Application in the center and its resources
  around it. Fill color shows the provider; ring color shows criticality.
- Clicking a resource, either a graph node or a badge in the table, opens the Resources page
  searched down to that resource (`/resources?q=<name>`).

## Tech stack

- [React 19](https://react.dev) with the [React Compiler](https://react.dev/learn/react-compiler)
- [Vite 8](https://vite.dev) and TypeScript
- [Mantine 9](https://mantine.dev) (UI) and [Mantine React Table v2](https://www.mantine-react-table.com) (tables, built on TanStack Table)
- [React Router](https://reactrouter.com)
- ESLint and Prettier

## Getting started

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0` (required by Vite 8)
- **Yarn** 1.x

### Install and run

```bash
yarn install
```

```bash
yarn dev
```

Then open the URL Vite prints (http://localhost:5173 by default).

### Other scripts

| Command        | What it does                                     |
| -------------- | ------------------------------------------------ |
| `yarn build`   | Type-checks (`tsc -b`) and builds to `dist/`     |
| `yarn preview` | Serves the production build locally              |
| `yarn lint`    | Runs ESLint (Prettier formatting is checked too) |

## Project structure

```
src/
├── main.tsx                 # Entry: router + theme + <App />
├── components/
│   ├── App.tsx              # App shell, header nav and routes
│   ├── AppNavBar.tsx
│   ├── AppTheme.tsx         # Mantine theme and global styles
│   ├── mantineCoreForMrt.tsx  # Mantine 9 compat shim for Mantine React Table (see below)
│   ├── common/              # Shared UI: FiltersPanel, SearchInput, MultiSelectFilter, badges, …
│   ├── ResourcesPage/       # Resources table, columns, selection footer, create form
│   └── ApplicationsPage/    # Applications table, columns, graph modal
│       └── ApplicationGraph/  # SVG hub-and-spoke graph and its nodes
├── hooks/                   # useApplications (localStorage), useTableUrlState (URL <-> table)
├── utils/                   # Pure helpers, one file per domain: {domain}Utils.ts
├── types/                   # Shared types, one file per domain: {domain}Types.ts
├── constants/               # Constants, one file per domain: {domain}Constants.ts
└── data/                    # Static resources data
```

## Implementation notes

- **Mantine React Table on Mantine 9.** Mantine React Table v2 targets Mantine 7, and Mantine 9
  renamed `Collapse`'s `in` prop to `expanded`. A Vite plugin in [`vite.config.ts`](vite.config.ts)
  points Mantine React Table's `@mantine/core` imports at
  [`src/components/mantineCoreForMrt.tsx`](src/components/mantineCoreForMrt.tsx), which re-exports
  Mantine with a patched `Collapse`.
  - Nothing imports that file directly, so IDEs show "0 usages", but **it is required**.
  - If you move it, update the path in `vite.config.ts`. If the browser then requests the old path,
    restart the dev server with `yarn dev --force` to refresh Vite's cached modules.
- **`'use no memo'` on the table pages.** TanStack Table updates its table object in place, so its
  reference never changes. The React Compiler's automatic memoization would then skip re-rendering
  the table, so `ResourcesPage` and `ApplicationsPage` opt out of the compiler. They memoize by hand
  with `useMemo` and `useCallback` instead.
- **Synchronous router updates.** `<BrowserRouter useTransitions={false}>` keeps the table in sync
  with the URL. With React Router's default transitions, the table could show stale rows after a
  sort or filter click.
- **URL format.** `q` holds the name search. `sort` is `column:direction` pairs separated by commas
  (`sort=criticality:desc,name:asc`). A multi-value filter repeats its column id once per value
  (`provider=AWS&provider=GCP`). A text filter uses one parameter (`id=res-00`).
