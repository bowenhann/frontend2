import React, { forwardRef } from 'react';
import { useNode } from '@craftjs/core';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BadgeSettings } from '@/components/settings/badge';

interface NodeBadgeProps extends BadgeProps {
  children?: React.ReactNode;
}

export const NodeBadge = forwardRef<HTMLDivElement, NodeBadgeProps>(({
  children = 'Badge',
  variant = 'default',
  className,
  ...props
}, ref) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Badge
      ref={(element) => {
        if (typeof ref === 'function') ref(element);
        else if (ref) ref.current = element;
        connect(drag(element));
      }}
      variant={variant}
      className={cn(className)}
      {...props}
    >
      {children}
    </Badge>
  );
});

NodeBadge.displayName = 'NodeBadge';

(NodeBadge as any).craft = {
  displayName: 'Badge',
  props: {
    children: 'Badge',
    variant: 'default',
  },
  related: {
    toolbar: BadgeSettings,
  },
};