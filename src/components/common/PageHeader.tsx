import type { FC } from 'react';
import { Text, Title } from '@mantine/core';

interface PageHeaderProps {
  title: string;
  description: string;
}

/** A page's title with a one-line description under it. */
const PageHeader: FC<PageHeaderProps> = ({ title, description }) => (
  <div>
    <Title order={2}>{title}</Title>
    <Text c="dimmed" size="sm">
      {description}
    </Text>
  </div>
);

export default PageHeader;
