import { Button, Group } from '@mantine/core';
import { IconApps, IconServer2 } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router';

import { ROUTES } from '../constants/routingConstants.ts';

const NAV_ITEMS = [
  { to: ROUTES.resources, label: 'Resources', icon: IconServer2 },
  { to: ROUTES.applications, label: 'Applications', icon: IconApps },
];

const AppNavBar = () => {
  const { pathname } = useLocation();

  return (
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
  );
};

export default AppNavBar;
