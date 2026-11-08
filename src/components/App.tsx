import { AppShell, Button, Group, Title } from '@mantine/core';
import { IconApps, IconServer2 } from '@tabler/icons-react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router';

import { ROUTES } from '../constants/routingConstants.ts';
import ApplicationsPage from './applications/ApplicationsPage.tsx';
import ResourcesPage from './resources/ResourcesPage.tsx';

const NAV_ITEMS = [
  { to: ROUTES.resources, label: 'Resources', icon: IconServer2 },
  { to: ROUTES.applications, label: 'Applications', icon: IconApps },
];

const App = () => {
  const { pathname } = useLocation();

  return (
    <AppShell header={{ height: 60 }} padding="lg">
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Title order={3}>Gambit</Title>
          <Group gap="xs" component="nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = pathname.startsWith(to);
              return (
                <Button
                  key={to}
                  component={Link}
                  to={to}
                  variant={active ? 'light' : 'subtle'}
                  color={active ? undefined : 'gray'}
                  leftSection={<Icon size={16} />}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Button>
              );
            })}
          </Group>
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
