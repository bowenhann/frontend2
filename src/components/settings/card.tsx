<<<<<<< HEAD
// @/components/settings/card-settings.tsx
=======
// @/components/settings/card.tsx
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
<<<<<<< HEAD
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export const CardSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title || ''}
          onChange={(e) => setProp((props: any) => props.title = e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={props.description || ''}
          onChange={(e) => setProp((props: any) => props.description = e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={props.content || ''}
          onChange={(e) => setProp((props: any) => props.content = e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="footerButtonText">Footer Button Text</Label>
        <Input
          id="footerButtonText"
          value={props.footerButtonText || ''}
          onChange={(e) => setProp((props: any) => props.footerButtonText = e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="hasHeader"
          checked={props.hasHeader}
          onCheckedChange={(checked) => setProp((props: any) => props.hasHeader = checked)}
        />
        <Label htmlFor="hasHeader">Show Header</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="hasFooter"
          checked={props.hasFooter}
          onCheckedChange={(checked) => setProp((props: any) => props.hasFooter = checked)}
        />
        <Label htmlFor="hasFooter">Show Footer</Label>
      </div>
      <div>
        <Label htmlFor="variant">Card Variant</Label>
        <Select
          value={props.variant || 'default'}
          onValueChange={(value: 'default' | 'destructive' | 'outline') => setProp((props: any) => props.variant = value)}
        >
          <SelectTrigger id="variant">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="padding">Padding</Label>
        <Slider
          id="padding"
          min={0}
          max={12}
          step={1}
          value={[props.padding || 4]}
          onValueChange={([value]) => setProp((props: any) => props.padding = value)}
        />
        <div className="text-sm text-gray-500 mt-1">Current padding: {props.padding || 4}</div>
      </div>
      {typeof props.children === 'string' && (
        <div>
          <Label htmlFor="children">Card Text</Label>
          <Input
            id="children"
            value={props.children}
            onChange={(e) => setProp((props: any) => props.children = e.target.value.replace(/<\/?[^>]+(>|$)/g, ''))}
          />
        </div>
      )}
    </div>
  );
};
=======

const TextSetting = ({ propName, label }) => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      <Label htmlFor={propName}>{label}</Label>
      <Input
        id={propName}
        value={props[propName] || ''}
        onChange={(e) => setProp((props) => (props[propName] = e.target.value))}
      />
    </div>
  );
};

export const CardSettings = () => {
  const { actions: { setProp }, props, nodes } = useNode((node) => ({
    props: node.data.props,
    nodes: node.data.nodes,
  }));

  const isChildrenMode = nodes && nodes.length > 0;

  if (isChildrenMode) {
    return (
      <div className="space-y-4">
        <TextSetting propName="className" label="Class Name" />
        <p>This card uses nested components. Edit individual components for more options.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TextSetting propName="className" label="Class Name" />
      <TextSetting propName="title" label="Card Title" />
      <div>
        <Label htmlFor="description">Card Description</Label>
        <Textarea
          id="description"
          value={props.description || ''}
          onChange={(e) => setProp((props) => (props.description = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="content">Card Content</Label>
        <Textarea
          id="content"
          value={props.content || ''}
          onChange={(e) => setProp((props) => (props.content = e.target.value))}
        />
      </div>
      <TextSetting propName="footerButtonText" label="Footer Button Text" />
    </div>
  );
};

// Keep the existing settings for individual components
export const CardTitleSettings = () => (
  <TextSetting propName="children" label="Title" />
);

export const CardDescriptionSettings = () => (
  <TextSetting propName="children" label="Description" />
);

export const CardContentSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        value={props.children || ''}
        onChange={(e) => setProp((props) => (props.children = e.target.value))}
      />
    </div>
  );
};

export const CardFooterSettings = () => (
  <TextSetting propName="buttonText" label="Footer Button Text" />
);
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
