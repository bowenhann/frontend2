import React from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div 
      ref={ref => connect(drag(ref))} 
      style={{ 
        display: 'flex', 
        width: '100%', 
        minHeight: '100px',
        border: '1px solid #ccc',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

export const ResizableItem = ({ children }) => {
  const { connectors: { connect } } = useNode();

  return (
    <div
      ref={connect}
      style={{
        flex: '1',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
};

ResizableItem.craft = {
  displayName: 'Resizable Item',
};