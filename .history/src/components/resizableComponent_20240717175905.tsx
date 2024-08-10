import React, { useState, useRef, useEffect } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children, initialWidth = '200px', initialHeight = '200px' }) => {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const { connectors: { connect, drag } } = useNode();
  const resizableRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    const resizable = resizableRef.current;
    const resizer = resizerRef.current;
    if (!resizable || !resizer) return;

    let startX, startY, startWidth, startHeight;

    const onMouseDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(resizable).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(resizable).height, 10);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      const newHeight = startHeight + e.clientY - startY;
      setSize({ width: `${newWidth}px`, height: `${newHeight}px` });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizer.addEventListener('mousedown', onMouseDown);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <div
      ref={(ref) => {
        resizableRef.current = ref;
        connect(drag(ref));
      }}
      style={{
        width: size.width,
        height: size.height,
        position: 'relative',
        border: '1px solid #ccc',
        overflow: 'hidden',
      }}
    >
      {children}
      <div
        ref={resizerRef}
        style={{
          width: '10px',
          height: '10px',
          position: 'absolute',
          right: '0',
          bottom: '0',
          cursor: 'se-resize',
          backgroundColor: '#4CAF50',
        }}
      />
    </div>
  );
};

ResizableComponent.craft = {
  displayName: 'Resizable Component',
  props: {
    initialWidth: '200px',
    initialHeight: '200px',
  },
  related: {
    toolbar: () => (
      <div>
        {/* Add any toolbar items specific to ResizableComponent here */}
      </div>
    ),
  },
};

// Test Element
export const TestElement = () => {
  return (
    <ResizableComponent initialWidth="300px" initialHeight="200px">
      <div style={{ padding: '20px' }}>
        <h2>Resizable Component</h2>
        <p>This is a test element inside a resizable component. You can resize this component by dragging the green handle in the bottom-right corner.</p>
      </div>
    </ResizableComponent>
  );
};

TestElement.craft = {
  displayName: 'Test Element',
};

// Usage in your main component
export const YourMainComponent = () => {
  return (
    <Editor resolver={{ ResizableComponent, TestElement }}>
      <Frame>
        <Element is={TestElement} canvas>
          {/* The content of TestElement will be here */}
        </Element>
      </Frame>
    </Editor>
  );
};