import { useMemo, type FC } from 'react';

import { CRITICALITY_COLORS } from '../../constants/criticalityConstants.ts';
import { ENVIRONMENT_COLORS } from '../../constants/environmentConstants.ts';
import { PROVIDER_COLORS } from '../../constants/providerConstants.ts';
import type { Criticality, Environment, Provider } from '../../types/resourceTypes.ts';
import ValueBadge, { type ValueBadgeProps } from '../common/ValueBadge.tsx';

type ResourceValueBadgeProps<V extends string> = Omit<ValueBadgeProps, 'children'> & { value: V };

export type ProviderBadgeProps = ResourceValueBadgeProps<Provider>;
export type EnvironmentBadgeProps = ResourceValueBadgeProps<Environment>;
export type CriticalityBadgeProps = ResourceValueBadgeProps<Criticality>;
export type TagBadgeProps = ResourceValueBadgeProps<string>;
export type PlainBadgeProps = ResourceValueBadgeProps<string>;

export const ProviderBadge: FC<ProviderBadgeProps> = ({ value, ...props }) => (
  <ValueBadge color={PROVIDER_COLORS[value]} variant="light" tt={undefined} {...props}>
    {value}
  </ValueBadge>
);

export const EnvironmentBadge: FC<EnvironmentBadgeProps> = ({ value, ...props }) => (
  <ValueBadge color={ENVIRONMENT_COLORS[value]} variant="dot" tt={undefined} {...props}>
    {value}
  </ValueBadge>
);

export const CriticalityBadge: FC<CriticalityBadgeProps> = ({ value, ...props }) => (
  <ValueBadge color={CRITICALITY_COLORS[value]} variant="filled" tt={undefined} {...props}>
    {value}
  </ValueBadge>
);

export const TagBadge: FC<TagBadgeProps> = ({ value, ...props }) => (
  <ValueBadge size="sm" variant="outline" color="gray" {...props}>
    {value}
  </ValueBadge>
);

/** For columns shown as plain text in the table (type, region, owner, id). */
export const PlainBadge: FC<PlainBadgeProps> = ({ value, ...props }) => (
  <ValueBadge variant="default" fw={500} {...props}>
    {value}
  </ValueBadge>
);

interface ResourceColumnBadgeProps {
  columnId: string;
  value: string;
  onRemove?(): void;
}

/** A resource column's value rendered with that column's badge. */
const ResourceColumnBadge: FC<ResourceColumnBadgeProps> = ({ columnId, value, onRemove }) => {
  const commonProps = useMemo(
    () => ({ onRemove, removeLabel: `Remove ${value} filter` }),
    [onRemove, value],
  );

  switch (columnId) {
    case 'provider':
      return <ProviderBadge value={value as Provider} {...commonProps} />;

    case 'environment':
      return <EnvironmentBadge value={value as Environment} {...commonProps} />;

    case 'criticality':
      return <CriticalityBadge value={value as Criticality} {...commonProps} />;

    case 'tags':
      return <TagBadge value={value} {...commonProps} />;

    default:
      return <PlainBadge value={value} {...commonProps} />;
  }
};

export default ResourceColumnBadge;
