import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const CollapsibleSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="triggerText">Trigger Text</Label>
        <Input
          id="triggerText"
          value={props.triggerText || ''}
          onChange={(e) => setProp((props: any) => (props.triggerText = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="children">Content</Label>
        <Textarea
          id="children"
          value={props.children || ''}
          onChange={(e) => setProp((props: any) => (props.children = e.target.value))}
        />
      </div>
    </div>
  );
};