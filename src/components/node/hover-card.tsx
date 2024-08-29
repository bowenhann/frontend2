// node/hover-card.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

export const NodeHoverCard = ({
  triggerText = 'Hover me',
  content = 'This is the hover card content.',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button ref={(ref) => connect(drag(ref)) as any} variant="link">
          {triggerText}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Hover Card</h4>
          <p className="text-sm">
            {content}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

NodeHoverCard.craft = {
  displayName: 'Hover Card',
  props: {
    triggerText: 'Hover me',
    content: 'This is the hover card content.',
  },
  related: {
    toolbar: () => { /* ... */ },
  },
};
