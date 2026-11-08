import { AppShell, Group, Title } from '@mantine/core';
import { Navigate, Route, Routes } from 'react-router';

import { ROUTES } from '../constants/routingConstants.ts';
import ApplicationsPage from './ApplicationsPage/ApplicationsPage.tsx';
import ResourcesPage from './ResourcesPage/ResourcesPage.tsx';
import AppNavBar from './AppNavBar.tsx';

const App = () => {
  return (
    <AppShell header={{ height: 60 }} padding="lg">
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Title order={3}>Gambit</Title>
          <AppNavBar />
        </Group>
      </AppShell.Header>

      <AppShell.Main display="flex" style={{ flexDirection: 'column' }}>
        <Routes>
          <Route path={ROUTES.resources} element={<ResourcesPage />} />
          <Route path={ROUTES.applications} element={<ApplicationsPage />} />
          <Route path="*" element={<Navigate to={ROUTES.resources} replace />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
