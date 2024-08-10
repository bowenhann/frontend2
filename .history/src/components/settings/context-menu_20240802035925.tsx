import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const ContextMenuSettings = () => {
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
        <Label htmlFor="items">Items (JSON)</Label>
        <Textarea
          id="items"
          value={JSON.stringify(props.items || [], null, 2)}
          onChange={(e) => {
            try {
              const items = JSON.parse(e.target.value);
              setProp((props: any) => (props.items = items));
            } catch (error) {
              console.error('Invalid JSON');
            }
          }}
        />
      </div>
    </div>
  );
};