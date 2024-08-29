import React from 'react';
import { useNode } from '@craftjs/core';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { CollapsibleSettings } from '@/components/settings/collapsible';

export const NodeCollapsible = ({
  triggerText = 'Toggle',
  children = 'Collapsible content',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Collapsible ref={(ref) => connect(drag(ref)) as any} {...props}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost">
          {triggerText}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

NodeCollapsible.craft = {
  displayName: 'Collapsible',
  props: {
    triggerText: 'Toggle',
    children: 'Collapsible content',
  },
  related: {
    toolbar: CollapsibleSettings,
  },
};
