<<<<<<< HEAD
=======
// @/components/settings/input.tsx
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
<<<<<<< HEAD
=======
import { Switch } from '@/components/ui/switch';
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const InputSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
<<<<<<< HEAD
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={props.label || ''}
          onChange={(e) => setProp((props: any) => (props.label = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={props.placeholder || ''}
          onChange={(e) => setProp((props: any) => (props.placeholder = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={props.type || 'text'}
          onValueChange={(value) => setProp((props: any) => (props.type = value))}
        >
          <SelectTrigger id="type">
=======
        <Label htmlFor="type">Input Type</Label>
        <Select
          onValueChange={(value) => setProp((props) => (props.type = value))}
          value={props.type}
        >
          <SelectTrigger>
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="number">Number</SelectItem>
          </SelectContent>
        </Select>
      </div>
<<<<<<< HEAD
=======
      <div>
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={props.placeholder}
          onChange={(e) => setProp((props) => (props.placeholder = e.target.value))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={props.disabled}
          onCheckedChange={(checked) => setProp((props) => (props.disabled = checked))}
        />
        <Label>Disabled</Label>
      </div>
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
    </div>
  );
};