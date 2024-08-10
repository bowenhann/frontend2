import React from 'react';
import { useNode } from '@craftjs/core';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { CommandSettings } from '@/components/settings/command';

export const NodeCommand = ({
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  items = [
    { group: 'Suggestions', items: ['Calendar', 'Search', 'Graphs'] },
    { group: 'Settings', items: ['Profile', 'Billing', 'Security'] },
  ],
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Command ref={(ref) => connect(drag(ref)) as any} {...props}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {items.map((group, index) => (
          <CommandGroup key={index} heading={group.group}>
            {group.items.map((item, itemIndex) => (
              <CommandItem key={itemIndex}>{item}</CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
};

NodeCommand.craft = {
  displayName: 'Command',
  props: {
    placeholder: 'Type a command or search...',
    emptyMessage: 'No results found.',
    items: [
      { group: 'Suggestions', items: ['Calendar', 'Search', 'Graphs'] },
      { group: 'Settings', items: ['Profile', 'Billing', 'Security'] },
    ],
  },
  related: {
    toolbar: CommandSettings,
  },
};
