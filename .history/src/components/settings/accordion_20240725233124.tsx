import React from 'react';
import { useNode } from '@craftjs/core';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

// Accordion Settings
export const AccordionSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>Accordion Type</Label>
        <Select
          value={props.type || 'single'}
          onValueChange={(value) => setProp((props: any) => props.type = value)}
        >
          <option value="single">Single</option>
          <option value="multiple">Multiple</option>
        </Select>
      </div>
      {props.type === 'single' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="collapsible"
            checked={props.collapsible}
            onCheckedChange={(checked) => setProp((props: any) => props.collapsible = checked)}
          />
          <Label htmlFor="collapsible">Collapsible</Label>
        </div>
      )}
    </div>
  );
};

// AccordionItem Settings
export const AccordionItemSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>Value</Label>
        <Input
          value={props.value || ''}
          onChange={(e) => setProp((props: any) => props.value = e.target.value)}
        />
      </div>
      <div>
        <Label>Disabled</Label>
        <Checkbox
          checked={props.disabled || false}
          onCheckedChange={(checked) => setProp((props: any) => props.disabled = checked)}
        />
      </div>
    </div>
  );
};

// AccordionTrigger Settings
export const AccordionTriggerSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>Trigger Text</Label>
        <Input
          value={props.children || ''}
          onChange={(e) => setProp((props: any) => props.children = e.target.value)}
        />
      </div>
    </div>
  );
};

// AccordionContent Settings
export const AccordionContentSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>Content</Label>
        <textarea
          className="w-full h-32 p-2 border rounded"
          value={props.children || ''}
          onChange={(e) => setProp((props: any) => props.children = e.target.value)}
        />
      </div>
    </div>
  );
};