import React from 'react';
import { useNode } from '@craftjs/core';
import { AccordionSingleProps, AccordionMultipleProps } from '@radix-ui/react-accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AccordionSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Accordion Type</Label>
        <Select
          value={props.type || 'single'}
          onValueChange={(value) => setProp((props: any) => (props.type = value))}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="multiple">Multiple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {props.type === 'single' && (
        <div className="flex items-center space-x-2">
          <Switch
            id="collapsible"
            checked={props.collapsible}
            onCheckedChange={(checked) => setProp((props: any) => (props.collapsible = checked))}
          />
          <Label htmlFor="collapsible">Collapsible</Label>
        </div>
      )}

      <div>
        <Label htmlFor="defaultValue">Default Open Item</Label>
        <Input
          id="defaultValue"
          value={props.defaultValue || ''}
          onChange={(e) => setProp((props: any) => (props.defaultValue = e.target.value))}
          placeholder="Enter item value"
        />
      </div>

      <div className="space-y-2">
        <Label>Accordion Items</Label>
        {props.items?.map((item: any, index: number) => (
          <div key={index} className="space-y-2 border p-2 rounded">
            <Input
              value={item.triggerText}
              onChange={(e) => setProp((props: any) => (props.items[index].triggerText = e.target.value))}
              placeholder="Trigger text"
            />
            <Input
              value={item.contentText}
              onChange={(e) => setProp((props: any) => (props.items[index].contentText = e.target.value))}
              placeholder="Content text"
            />
          </div>
        ))}
        <button
          onClick={() => setProp((props: any) => props.items.push({ triggerText: '', contentText: '' }))}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Add Item
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="disabled"
          checked={props.disabled}
          onCheckedChange={(checked) => setProp((props: any) => (props.disabled = checked))}
        />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
    </div>
  );
};