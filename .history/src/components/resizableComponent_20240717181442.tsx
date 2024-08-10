import React from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={ref => connect(drag(ref))}
      style={{
        width: '100%',
        minHeight: '100px',
        border: '1px solid #ccc',
        padding: '10px',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
  props: {},
  rules: {
    canDrag: true,
    canDrop: true,
    canMoveIn: true,
    canMoveOut: true,
  },
};