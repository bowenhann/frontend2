import React from 'react';
import { useNode } from '@craftjs/core';

export const DynamicContent = ({ components }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={ref => connect(drag(ref))}
      className="bg-yellow-100 p-2 m-2 rounded flex flex-wrap"
    >
      {components}
    </div>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  props: {},
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};