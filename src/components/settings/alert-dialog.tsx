import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AlertDialogSettings = () => {
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title || ''}
          onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={props.description || ''}
          onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="cancelText">Cancel Text</Label>
        <Input
          id="cancelText"
          value={props.cancelText || ''}
          onChange={(e) => setProp((props: any) => (props.cancelText = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="actionText">Action Text</Label>
        <Input
          id="actionText"
          value={props.actionText || ''}
          onChange={(e) => setProp((props: any) => (props.actionText = e.target.value))}
        />
      </div>
    </div>
  );
};
