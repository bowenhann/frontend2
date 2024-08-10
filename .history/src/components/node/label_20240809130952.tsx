// node/label.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';

export const NodeLabel = ({
  text = 'Label',
  htmlFor,
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Label
      ref={(ref) => connect(drag(ref))}
      htmlFor={htmlFor}
      {...props}
    >
      {text}
    </Label>
  );
};

NodeLabel.craft = {
  displayName: 'Label',
  props: {
    text: 'Label',
    htmlFor: '',
  },
  related: {
    toolbar: () => { /* ... */ },
  },
};

// settings/label.tsx
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
        <Label htmlFor="text">Label Text</Label>
        <Input
          id="text"
          value={props.text || ''}
          onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="htmlFor">For (ID of associated form element)</Label>
        <Input
          id="htmlFor"
          value={props.htmlFor || ''}
          onChange={(e) => setProp((props: any) => (props.htmlFor = e.target.value))}
        />
      </div>
    </div>
  );
};

// node/menubar.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarCheckboxItem,
} from '@/components/ui/menubar';

export const NodeMenubar = ({
  items = [
    {
      trigger: 'File',
      items: [
        { type: 'item', label: 'New Tab', shortcut: '⌘T' },
        { type: 'item', label: 'New Window', shortcut: '⌘N' },
        { type: 'separator' },
        { type: 'item', label: 'Share', shortcut: '⌘S' },
        { type: 'item', label: 'Print', shortcut: '⌘P' },
      ],
    },
    {
      trigger: 'Edit',
      items: [
        { type: 'item', label: 'Undo', shortcut: '⌘Z' },
        { type: 'item', label: 'Redo', shortcut: '⇧⌘Z' },
        { type: 'separator' },
        { type: 'sub', label: 'Find', items: [
          { type: 'item', label: 'Search the web' },
          { type: 'separator' },
          { type: 'item', label: 'Find...' },
          { type: 'item', label: 'Find Next' },
          { type: 'item', label: 'Find Previous' },
        ]},
      ],
    },
  ],
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      switch (item.type) {
        case 'item':
          return (
            <MenubarItem key={index}>
              {item.label}
              {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
            </MenubarItem>
          );
        case 'checkbox':
          return (
            <MenubarCheckboxItem key={index} checked={item.checked}>
              {item.label}
            </MenubarCheckboxItem>
          );
        case 'radio':
          return (
            <MenubarRadioItem key={index} value={item.value}>
              {item.label}
            </MenubarRadioItem>
          );
        case 'separator':
          return <MenubarSeparator key={index} />;
        case 'sub':
          return (
            <MenubarSub key={index}>
              <MenubarSubTrigger>{item.label}</MenubarSubTrigger>
              <MenubarSubContent>
                {renderMenuItems(item.items)}
              </MenubarSubContent>
            </MenubarSub>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Menubar ref={(ref) => connect(drag(ref))}>
      {items.map((menu, index) => (
        <MenubarMenu key={index}>
          <MenubarTrigger>{menu.trigger}</MenubarTrigger>
          <MenubarContent>
            {renderMenuItems(menu.items)}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

NodeMenubar.craft = {
  displayName: 'Menubar',
  props: {
    items: [
      {
        trigger: 'File',
        items: [
          { type: 'item', label: 'New Tab', shortcut: '⌘T' },
          { type: 'item', label: 'New Window', shortcut: '⌘N' },
          { type: 'separator' },
          { type: 'item', label: 'Share', shortcut: '⌘S' },
          { type: 'item', label: 'Print', shortcut: '⌘P' },
        ],
      },
      {
        trigger: 'Edit',
        items: [
          { type: 'item', label: 'Undo', shortcut: '⌘Z' },
          { type: 'item', label: 'Redo', shortcut: '⇧⌘Z' },
          { type: 'separator' },
          { type: 'sub', label: 'Find', items: [
            { type: 'item', label: 'Search the web' },
            { type: 'separator' },
            { type: 'item', label: 'Find...' },
            { type: 'item', label: 'Find Next' },
            { type: 'item', label: 'Find Previous' },
          ]},
        ],
      },
    ],
  },
  related: {
    toolbar: () => { /* ... */ },
  },
};

// settings/menubar.tsx
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

// components-map.tsx (updated)
import { NodeLabel } from './node/label';
import { LabelSettings } from './settings/label';
import { NodeMenubar } from './node/menubar';
import { MenubarSettings } from './settings/menubar';

// ... (existing imports)

export const componentsMap: Components[] = [
  // ... (existing components)
  {
    name: 'Forms',
    items: [
      // ... (existing form components)
      {
        name: 'Label',
        demo: <Label htmlFor="email">Email</Label>,
        node: <NodeLabel />,
      },
    ],
  },
  {
    name: 'Navigation',
    items: [
      // ... (existing navigation components)
      {
        name: 'Menubar',
        demo: (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
                <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                <MenubarItem>Print... <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ),
        node: <NodeMenubar />,
      },
    ],
  },
  // ... (other components)
];

// Add this to the existing NodeLabel.craft and NodeMenubar.craft objects
NodeLabel.craft.related.toolbar = LabelSettings;
NodeMenubar.craft.related.toolbar = MenubarSettings;