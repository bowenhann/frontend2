import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const BadgeSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="children">Text</Label>
        <Input
          id="children"
          value={props.children || ''}
          onChange={(e) => setProp((props: any) => (props.children = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="variant">Variant</Label>
        <Select
          value={props.variant || 'default'}
          onValueChange={(value) => setProp((props: any) => (props.variant = value))}
        >
          <SelectTrigger id="variant">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};