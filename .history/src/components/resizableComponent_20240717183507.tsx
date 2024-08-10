import React, { useState, useRef, useEffect } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [size, setSize] = useState({ width: 300, height: 200 });
  const componentRef = useRef(null);

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'RESIZABLE_COMPONENT_MOUNTED' }, '*');
    }

    const handleResize = (event) => {
      if (event.data.type === 'RESIZE') {
        setSize(event.data.size);
      }
    };

    window.addEventListener('message', handleResize);

    return () => {
      window.removeEventListener('message', handleResize);
    };
  }, []);

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
      }}
    >
      <div style={{ padding: '10px', width: '100%', height: '100%', overflow: 'auto' }}>
        {children}
      </div>
      <div
        className="resize-handle right"
        style={{
          position: 'absolute',
          right: -4,
          top: 0,
          width: 8,
          height: '100%',
          cursor: 'ew-resize',
        }}
      />
      <div
        className="resize-handle bottom"
        style={{
          position: 'absolute',
          bottom: -4,
          left: 0,
          width: '100%',
          height: 8,
          cursor: 'ns-resize',
        }}
      />
      <div
        className="resize-handle corner"
        style={{
          position: 'absolute',
          right: -4,
          bottom: -4,
          width: 8,
          height: 8,
          cursor: 'nwse-resize',
        }}
      />
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
};