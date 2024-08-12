import React from 'react';
import { useNode } from '@craftjs/core';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const MenubarSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="items">Menu Items (JSON)</Label>
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