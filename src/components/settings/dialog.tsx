import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const DialogSettings = () => {
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
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={props.content || ''}
          onChange={(e) => setProp((props: any) => (props.content = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="closeText">Close Button Text</Label>
        <Input
          id="closeText"
          value={props.closeText || ''}
          onChange={(e) => setProp((props: any) => (props.closeText = e.target.value))}
        />
      </div>
    </div>
  );
};