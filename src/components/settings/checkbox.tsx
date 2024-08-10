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
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="disabled"
          checked={props.disabled || false}
          onCheckedChange={(checked) => setProp((props: any) => (props.disabled = checked))}
        />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
    </div>
  );
};