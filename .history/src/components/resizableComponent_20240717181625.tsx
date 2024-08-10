import React from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div ref={ref => connect(drag(ref))}>
      {children}
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
};