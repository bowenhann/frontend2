<<<<<<< HEAD
=======
// @/components/settings/checkbox.tsx
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const CheckboxSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
<<<<<<< HEAD
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={props.label || ''}
          onChange={(e) => setProp((props: any) => (props.label = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="id">ID</Label>
        <Input
          id="id"
          value={props.id || ''}
          onChange={(e) => setProp((props: any) => (props.id = e.target.value))}
=======
      <div className="space-y-2">
        <Label htmlFor="label">Checkbox Label</Label>
        <Input
          id="label"
          value={props.label || ''}
          onChange={(e) => setProp((props) => (props.label = e.target.value))}
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
<<<<<<< HEAD
          id="disabled"
          checked={props.disabled || false}
          onCheckedChange={(checked) => setProp((props: any) => (props.disabled = checked))}
        />
        <Label htmlFor="disabled">Disabled</Label>
=======
          id="checked"
          checked={props.checked}
          onCheckedChange={(checked) => setProp((props) => (props.checked = checked))}
        />
        <Label htmlFor="checked">Initial Checked State</Label>
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
      </div>
    </div>
  );
};