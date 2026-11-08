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

/** Renders a resource column's filter value exactly like that column's cells. */
// eslint-disable-next-line react-refresh/only-export-components
export const renderResourceFilterValue = (
  columnId: string,
  value: string,
  onRemove?: () => void,
) => {
  const removeLabel = `Remove ${value} filter`;
  switch (columnId) {
    case 'provider':
      return (
        <ProviderBadge value={value as Provider} onRemove={onRemove} removeLabel={removeLabel} />
      );
    case 'environment':
      return (
        <EnvironmentBadge
          value={value as Environment}
          onRemove={onRemove}
          removeLabel={removeLabel}
        />
      );
    case 'criticality':
      return (
        <CriticalityBadge
          value={value as Criticality}
          onRemove={onRemove}
          removeLabel={removeLabel}
        />
      );
    case 'tags':
      return <TagBadge value={value} onRemove={onRemove} removeLabel={removeLabel} />;
    default:
      return <PlainBadge value={value} onRemove={onRemove} removeLabel={removeLabel} />;
  }
};
