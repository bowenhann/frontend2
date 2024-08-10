import React, { useState, useRef, useEffect } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [size, setSize] = useState({ width: 300, height: 200 });
  const componentRef = useRef(null);

  useEffect(() => {
    const handleResize = (newSize) => {
      setSize(newSize);
    };

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'RESIZABLE_COMPONENT_MOUNTED' }, '*');
    }

    window.addEventListener('message', (event) => {
      if (event.data.type === 'INIT_RESIZE') {
        const { direction, startX, startY } = event.data;
        initResize(direction, startX, startY);
      }
    });

    return () => {
      window.removeEventListener('message', handleResize);
    };
  }, []);

  const initResize = (direction, startX, startY) => {
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      let newSize = { ...size };

      if (direction === 'horizontal' || direction === 'both') {
        newSize.width = Math.max(100, startWidth + moveEvent.clientX - startX);
      }
      if (direction === 'vertical' || direction === 'both') {
        newSize.height = Math.max(100, startHeight + moveEvent.clientY - startY);
      }

      setSize(newSize);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={ref => {
        componentRef.current = ref;
        connect(drag(ref));
      }}
      style={{
        width: size.width,
        height: size.height,
        position: 'relative',
        border: '1px solid #ccc',
        padding: '10px',
        overflow: 'auto'
      }}
    >
      {children}
      <div
        className="resize-handle right"
        style={{
          position: 'absolute',
          right: -5,
          top: 0,
          width: '10px',
          height: '100%',
          cursor: 'ew-resize',
        }}
      />
      <div
        className="resize-handle bottom"
        style={{
          position: 'absolute',
          bottom: -5,
          left: 0,
          width: '100%',
          height: '10px',
          cursor: 'ns-resize',
        }}
      />
      <div
        className="resize-handle corner"
        style={{
          position: 'absolute',
          right: -5,
          bottom: -5,
          width: '10px',
          height: '10px',
          cursor: 'nwse-resize',
        }}
      />
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
};