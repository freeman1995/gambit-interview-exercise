import type { FC, PropsWithChildren } from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

const theme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
});

const AppTheme: FC<PropsWithChildren> = ({ children }) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);

export default AppTheme;
