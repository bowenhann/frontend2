import React, { useState, useRef, useEffect } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [size, setSize] = useState({ width: 300, height: 200 });
  const componentRef = useRef(null);

  const handleMouseDown = (direction) => (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent) => {
      if (direction === 'horizontal' || direction === 'both') {
        const newWidth = startWidth + moveEvent.clientX - startX;
        setSize(prev => ({ ...prev, width: newWidth }));
      }
      if (direction === 'vertical' || direction === 'both') {
        const newHeight = startHeight + moveEvent.clientY - startY;
        setSize(prev => ({ ...prev, height: newHeight }));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div style={{ position: 'relative', width: size.width, height: size.height }}>
      <div
        ref={ref => {
          componentRef.current = ref;
          connect(drag(ref));
        }}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #ccc',
          padding: '10px',
          overflow: 'auto'
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          right: -5,
          top: 0,
          width: '10px',
          height: '100%',
          cursor: 'ew-resize',
        }}
        onMouseDown={handleMouseDown('horizontal')}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -5,
          left: 0,
          width: '100%',
          height: '10px',
          cursor: 'ns-resize',
        }}
        onMouseDown={handleMouseDown('vertical')}
      />
      <div
        style={{
          position: 'absolute',
          right: -5,
          bottom: -5,
          width: '10px',
          height: '10px',
          cursor: 'nwse-resize',
        }}
        onMouseDown={handleMouseDown('both')}
      />
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
};