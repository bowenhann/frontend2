<<<<<<< HEAD
import React, { forwardRef } from 'react';
import { useNode } from '@craftjs/core';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BadgeSettings } from '@/components/settings/badge';

// 定义 Props 类型
interface NodeBadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  [key: string]: any;
}

export const NodeBadge = forwardRef<HTMLDivElement, NodeBadgeProps>(({
  children = 'Badge',
  variant = 'default',
  className,
  ...props
}, ref) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div ref={(element) => {
      connect(drag(element));
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    }}>
      <Badge
        variant={variant}
        className={cn(className)}
        {...props}
      >
=======
// @/components/node/badge.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Badge } from '@/components/ui/badge';
import { BadgeSettings } from '@/components/settings/badge';

export const NodeBadge = ({ children, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(ref) => ref && connect(drag(ref)) as any}
      className="inline-block m-1" // Add margin and make it inline-block
    >
      <Badge {...props}>
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
        {children}
      </Badge>
    </div>
  );
<<<<<<< HEAD
});

NodeBadge.displayName = 'NodeBadge';

(NodeBadge as any).craft = {
  displayName: 'Badge',
  props: {
    children: 'Badge',
    variant: 'default',
=======
};

NodeBadge.craft = {
  displayName: 'Badge',
  props: {
    variant: 'default',
    children: 'Badge',
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  },
  related: {
    toolbar: BadgeSettings,
  },
};