<<<<<<< HEAD
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
    <div ref={(ref) => connect(drag(ref)) as any} className="space-y-2">
      <Label htmlFor="input">{label}</Label>
      <Input id="input" type={type} placeholder={placeholder} {...props} />
    </div>
=======
// @/components/node/input.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { InputSettings } from '@/components/settings/input';

export const NodeInput = ({ ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Input 
      {...props} 
      ref={(ref) => ref && connect(drag(ref)) as any}
    />
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  );
};

NodeInput.craft = {
  displayName: 'Input',
  props: {
<<<<<<< HEAD
    label: 'Label',
    placeholder: 'Type here...',
    type: 'text',
  },
  related: {
    toolbar: () => { /* ... */ },
=======
    type: 'text',
    placeholder: 'Enter text...',
    disabled: false,
  },
  related: {
    toolbar: InputSettings,
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  },
};