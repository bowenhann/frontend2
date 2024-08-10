import React, { useState, useRef, useEffect } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [size, setSize] = useState({ width: 300, height: 200 });
  const componentRef = useRef(null);

  const handleMouseDown = (direction) => (e) => {
    e.preventDefault();
    const iframe = window.frameElement;
    if (!iframe) return;

    const iframeRect = iframe.getBoundingClientRect();
    const startX = e.clientX - iframeRect.left;
    const startY = e.clientY - iframeRect.top;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const newX = moveEvent.clientX - iframeRect.left;
      const newY = moveEvent.clientY - iframeRect.top;

      if (direction === 'horizontal' || direction === 'both') {
        const newWidth = Math.max(100, startWidth + newX - startX);
        setSize(prev => ({ ...prev, width: newWidth }));
      }
      if (direction === 'vertical' || direction === 'both') {
        const newHeight = Math.max(100, startHeight + newY - startY);
        setSize(prev => ({ ...prev, height: newHeight }));
      }
    };

    const handleMouseUp = () => {
      window.parent.document.removeEventListener('mousemove', handleMouseMove);
      window.parent.document.removeEventListener('mouseup', handleMouseUp);
    };

    window.parent.document.addEventListener('mousemove', handleMouseMove);
    window.parent.document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={ref => {
        componentRef.current = ref;
        connect(drag(ref));
      }}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        position: 'relative',
        border: '1px solid #ccc',
        padding: '10px',
        overflow: 'auto'
      }}
    >
      {children}
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