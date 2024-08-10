import React from 'react';
import { useNode } from '@craftjs/core';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu';
import { ContextMenuSettings } from '@/components/settings/context-menu';

export const NodeContextMenu = ({
  triggerText = 'Right click here',
  items = [
    { label: 'Back', shortcut: '⌘[' },
    { label: 'Forward', shortcut: '⌘]' },
    { label: 'Reload', shortcut: '⌘R' },
    { type: 'separator' },
    {
      label: 'More Tools',
      items: [
        { label: 'Save Page As...', shortcut: '⌘S' },
        { label: 'Create Shortcut...' },
        { label: 'Name Window...' },
      ],
    },
  ],
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  const renderItems = (items) => {
    return items.map((item, index) => {
      if (item.type === 'separator') {
        return <ContextMenuSeparator key={index} />;
      }
      if (item.items) {
        return (
          <ContextMenuSub key={index}>
            <ContextMenuSubTrigger>{item.label}</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {renderItems(item.items)}
            </ContextMenuSubContent>
          </ContextMenuSub>
        );
      }
      return (
        <ContextMenuItem key={index}>
          {item.label}
          {item.shortcut && <span className="ml-auto text-xs tracking-widest text-muted-foreground">{item.shortcut}</span>}
        </ContextMenuItem>
      );
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger ref={(ref) => connect(drag(ref)) as any} className="border p-4">
        {triggerText}
      </ContextMenuTrigger>
      <ContextMenuContent>
        {renderItems(items)}
      </ContextMenuContent>
    </ContextMenu>
  );
};

NodeContextMenu.craft = {
  displayName: 'Context Menu',
  props: {
    triggerText: 'Right click here',
    items: [
      { label: 'Back', shortcut: '⌘[' },
      { label: 'Forward', shortcut: '⌘]' },
      { label: 'Reload', shortcut: '⌘R' },
      { type: 'separator' },
      {
        label: 'More Tools',
        items: [
          { label: 'Save Page As...', shortcut: '⌘S' },
          { label: 'Create Shortcut...' },
          { label: 'Name Window...' },
        ],
      },
    ],
  },
  related: {
    toolbar: () => { ContextMenuSettings },
  },
};