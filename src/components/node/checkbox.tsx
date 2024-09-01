import React from 'react';
import { useNode } from '@craftjs/core';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckboxSettings } from '@/components/settings/checkbox';

<<<<<<< HEAD
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
=======
export const NodeCheckbox = ({ label, ...props }) => {
  const { connectors: { connect, drag }, actions: { setProp }, checked } = useNode((node) => ({
    checked: node.data.props.checked
  }));

  const handleCheckedChange = (checked: boolean) => {
    setProp((props) => (props.checked = checked));
  };

  return (
    <div className="flex items-center space-x-2" ref={(ref) => ref && connect(drag(ref)) as any}>
      <Checkbox 
        id="node-checkbox" 
        checked={checked}
        onCheckedChange={handleCheckedChange}
        {...props} 
      />
      {label && <Label htmlFor="node-checkbox">{label}</Label>}
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
    </div>
  );
};

NodeCheckbox.craft = {
  displayName: 'Checkbox',
  props: {
<<<<<<< HEAD
    label: 'Checkbox',
    id: 'terms',
=======
    label: 'Checkbox Label',
    checked: false,
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  },
  related: {
    toolbar: CheckboxSettings,
  },
<<<<<<< HEAD
};
=======
};
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
