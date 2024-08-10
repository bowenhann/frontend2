import React from 'react';
import { useNode } from '@craftjs/core';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertSettings } from '@/components/settings/alert';
import { cn } from '@/lib/utils';

export const NodeAlert = ({
  title = 'Alert Title',
  description = 'Alert Description',
  variant = 'default',
  className,
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Alert
      ref={(ref) => connect(drag(ref))}
      variant={variant}
      className={cn(className)}
      {...props}
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

NodeAlert.craft = {
  displayName: 'Alert',
  props: {
    title: 'Alert Title',
    description: 'Alert Description',
    variant: 'default',
  },
  related: {
    toolbar: AlertSettings,
  },
};