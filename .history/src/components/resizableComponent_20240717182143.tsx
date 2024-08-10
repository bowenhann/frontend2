import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [size, setSize] = useState({ width: 300, height: 200 });
  const componentRef = useRef(null);
  const isResizing = useRef(false);

  const handleResize = useCallback((e) => {
    if (!isResizing.current) return;
    
    const { direction, startSize, startPosition } = isResizing.current;
    
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;

    setSize(prevSize => ({
      width: direction === 'horizontal' || direction === 'both'
        ? Math.max(100, startSize.width + deltaX)
        : prevSize.width,
      height: direction === 'vertical' || direction === 'both'
        ? Math.max(100, startSize.height + deltaY)
        : prevSize.height
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleResize]);

  const handleMouseDown = useCallback((direction) => (e) => {
    e.preventDefault();
    isResizing.current = {
      direction,
      startSize: { ...size },
      startPosition: { x: e.clientX, y: e.clientY }
    };
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleMouseUp);
  }, [size, handleResize, handleMouseUp]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleResize, handleMouseUp]);

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