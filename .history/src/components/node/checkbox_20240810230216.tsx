import React from 'react';
import { useNode } from '@craftjs/core';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckboxSettings } from '@/components/settings/checkbox';

export const NodeCheckbox = ({
  label = 'Checkbox',
  id = 'terms',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div className="flex items-center space-x-2" ref={(ref) => connect(drag(ref)) as any}>
      <Checkbox id={id} {...props} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};

NodeCheckbox.craft = {
  displayName: 'Checkbox',
  props: {
    label: 'Checkbox',
    id: 'terms',
  },
  related: {
    toolbar: CheckboxSettings,
  },
};
