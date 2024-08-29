import { withNode } from '@/components/node/connector';
import { SettingsControl } from '@/components/settings-control';
import React from 'react';
import { Element } from '@craftjs/core';

const draggable = true;
const droppable = true;

interface OneBlockProps extends React.HTMLAttributes<HTMLDivElement> {}

export const OneBlock = React.forwardRef<HTMLDivElement, OneBlockProps>(
  ({ ...props }, ref) => {
    const Comp = 'div';
    return <Comp ref={ref} {...props} />;
  }
);

OneBlock.displayName = 'div';

export const NodeOneBlock = withNode(OneBlock, {
  draggable,
  droppable,
});

interface NodeTwoBlocksProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NodeTwoBlocks = ({ ...props }: NodeTwoBlocksProps) => {
  return (
    <NodeOneBlock {...props}>
      <Element
        canvas
        is={NodeOneBlock as typeof NodeOneBlock & string}
        id="first-block"
      />
      <Element
        canvas
        is={NodeOneBlock as typeof NodeOneBlock & string}
        id="second-block"
      />
    </NodeOneBlock>
  );
};

NodeTwoBlocks.craft = {
  displayName: 'div',
  props: {
    className: 'flex flex-row m-2 p-4',
  },
  related: {
    toolbar: SettingsControl,
  },
};

(NodeOneBlock as any).craft = {
  ...((NodeOneBlock as any).craft || {}),
  props: {
    className: 'w-full',
  },
  related: {
    toolbar: SettingsControl,
  },
};
