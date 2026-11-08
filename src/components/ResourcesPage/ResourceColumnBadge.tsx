import { CRITICALITY_COLORS } from '../../constants/criticalityConstants.ts';
import { ENVIRONMENT_COLORS } from '../../constants/environmentConstants.ts';
import { PROVIDER_COLORS } from '../../constants/providerConstants.ts';
import type { Criticality, Environment, Provider } from '../../types/resourceTypes.ts';
import ValueBadge, { type ValueBadgeProps } from '../common/ValueBadge.tsx';

type Props<V> = Omit<ValueBadgeProps, 'children'> & { value: V };

export const ProviderBadge = ({ value, ...props }: Props<Provider>) => (
  <ValueBadge color={PROVIDER_COLORS[value]} variant="light" tt={undefined} {...props}>
    {value}
  </ValueBadge>
);

export const EnvironmentBadge = ({ value, ...props }: Props<Environment>) => (
  <ValueBadge color={ENVIRONMENT_COLORS[value]} variant="dot" tt={undefined} {...props}>
    {value}
  </ValueBadge>
);

export const CriticalityBadge = ({ value, ...props }: Props<Criticality>) => (
  <ValueBadge color={CRITICALITY_COLORS[value]} variant="filled" tt={undefined} {...props}>
    {value}
  </ValueBadge>
);

export const TagBadge = ({ value, ...props }: Props<string>) => (
  <ValueBadge size="sm" variant="outline" color="gray" {...props}>
    {value}
  </ValueBadge>
);

/** For columns shown as plain text in the table (type, region, owner, id). */
export const PlainBadge = ({ value, ...props }: Props<string>) => (
  <ValueBadge variant="default" fw={500} {...props}>
    {value}
  </ValueBadge>
);

interface ResourceColumnBadgeProps {
  columnId: string;
  value: string;
  onRemove?(): void;
}

const ResourceColumnBadge = ({ columnId, value, onRemove }: ResourceColumnBadgeProps) => {
  const commonProps = {
    onRemove,
    removeLabel: `Remove ${value} filter`,
  };

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
