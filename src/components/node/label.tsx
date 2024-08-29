import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';

export const NodeLabel = ({
  htmlFor,
  children = 'Label',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Label
      ref={(ref) => connect(drag(ref)) as any}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </Label>
  );
};

NodeLabel.craft = {
  displayName: 'Label',
  props: {
    htmlFor: '',
    children: 'Label',
  },
  related: {
    toolbar: () => { /* ... */ },
  },
};