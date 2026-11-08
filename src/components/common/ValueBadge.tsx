import type { MouseEvent } from 'react';
import { Badge, type BadgeProps, CloseButton } from '@mantine/core';

export interface ValueBadgeProps extends BadgeProps {
  /** When set, the badge gets a small × button (used for selected filter values). */
  onRemove?: () => void;
  removeLabel?: string;
}

/** Badge used for cell values, filter options/selections and the active-filters panel. */
const ValueBadge = ({ onRemove, removeLabel, children, ...badgeProps }: ValueBadgeProps) => {
  const handleRemove = (event: MouseEvent) => {
    event.stopPropagation();
    onRemove?.();
  };

  return (
    <Badge
      tt="none"
      {...badgeProps}
      rightSection={
        onRemove ? (
          <CloseButton
            size={14}
            iconSize={10}
            variant="transparent"
            c="inherit"
            aria-label={removeLabel ?? 'Remove'}
            // Keep focus (and any open dropdown) where it is.
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleRemove}
          />
        ) : undefined
      }
    >
      {children}
    </Badge>
  );
};

export default ValueBadge;
