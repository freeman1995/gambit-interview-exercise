import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './components/App.tsx';
import AppTheme from './components/AppTheme.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      Table state (search/filters/sorting) lives in the URL. TanStack Table mutates its instance
      during render, which doesn't play well with concurrent rendering: with location updates
      wrapped in startTransition (react-router's default), the table could stay stale after a
      sort/filter click. Synchronous router updates keep the table in step with the URL.
    */}
    <BrowserRouter useTransitions={false}>
      <AppTheme>
        <App />
      </AppTheme>
    </BrowserRouter>
  </StrictMode>,
);
