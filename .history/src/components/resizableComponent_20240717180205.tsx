import React, { useState, useRef, useEffect } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [size, setSize] = useState({ width: 300, height: 200 });
  const resizeHandleRef = useRef(null);

  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    if (!resizeHandle) return;

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    const onMouseDown = (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = size.width;
      startHeight = size.height;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizeHandle.addEventListener('mousedown', onMouseDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', onMouseDown);
    };
  }, [size]);

  return (
    <div
      ref={ref => connect(drag(ref))}
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
        ref={resizeHandleRef}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '20px',
          height: '20px',
          cursor: 'se-resize',
          background: '#ddd'
        }}
      />
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