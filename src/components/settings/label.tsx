import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const LabelSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="labelText">Label Text</Label>
        <Input
          id="labelText"
          value={props.children || ''}
          onChange={(e) => setProp((props: any) => (props.children = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="htmlFor">For (ID of associated input)</Label>
        <Input
          id="htmlFor"
          value={props.htmlFor || ''}
          onChange={(e) => setProp((props: any) => (props.htmlFor = e.target.value))}
        />
      </div>
    </div>
  );
};