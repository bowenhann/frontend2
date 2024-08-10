import React from 'react';
import { useNode } from '@craftjs/core';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BadgeSettings } from '@/components/settings/badge';

export const NodeBadge = ({
  children = 'Badge',
  variant = 'default',
  className,
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Badge
      ref={(ref) => connect(drag(ref))}
      variant={variant as any}
      className={cn(className)}
      {...props}
    >
      {children}
    </Badge>
  );
};

NodeBadge.craft = {
  displayName: 'Badge',
  props: {
    children: 'Badge',
    variant: 'default',
  },
  related: {
    toolbar: BadgeSettings,
  },
};