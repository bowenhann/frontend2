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
        {children}
      </Badge>
    </div>
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