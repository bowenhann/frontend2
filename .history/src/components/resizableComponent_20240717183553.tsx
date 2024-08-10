import React from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div 
      ref={ref => connect(drag(ref))}
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '5px',
        minHeight: '50px'
      }}
    >
      {children}
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
};