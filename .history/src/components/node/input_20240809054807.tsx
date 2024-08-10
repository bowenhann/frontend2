import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const NodeInput = ({
  label = 'Label',
  placeholder = 'Type here...',
  type = 'text',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="space-y-2">
      <Label htmlFor="input">{label}</Label>
      <Input id="input" type={type} placeholder={placeholder} {...props} />
    </div>
  );
};

NodeInput.craft = {
  displayName: 'Input',
  props: {
    label: 'Label',
    placeholder: 'Type here...',
    type: 'text',
  },
  related: {
    toolbar: () => { /* ... */ },
  },
};