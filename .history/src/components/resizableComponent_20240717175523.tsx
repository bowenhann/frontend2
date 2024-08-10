import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [size, setSize] = useState({ width: '100%', height: 'auto' });
  const containerRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const resizer = resizerRef.current;
    if (!container || !resizer) return;

    let startX, startY, startWidth, startHeight;

    const onMouseDown = (e) => {
      e.stopPropagation(); // Prevent event from bubbling up to Craft.js
      startX = e.clientX;
      startY = e.clientY;
      startWidth = container.offsetWidth;
      startHeight = container.offsetHeight;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newWidth = Math.max(100, startWidth + dx); // Minimum width of 100px
      const newHeight = Math.max(50, startHeight + dy); // Minimum height of 50px
      setSize({
        width: `${newWidth}px`,
        height: `${newHeight}px`
      });
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
        containerRef.current = ref;
        connect(drag(ref));
      }}
      style={{
        width: size.width,
        height: size.height,
        border: '1px solid #ccc',
        position: 'relative',
        overflow: 'auto',
        padding: '10px'
      }}
    >
      {children}
      <div
        ref={resizerRef}
        style={{
          width: '20px',
          height: '20px',
          position: 'absolute',
          right: '0',
          bottom: '0',
          cursor: 'se-resize',
          backgroundColor: '#ddd',
          zIndex: 1000
        }}
      />
    </div>
  );
};

ResizableContainer.craft = {
  displayName: 'Resizable Container',
  props: {},
  related: {
    toolbar: () => (
      <div>
        {/* Add any toolbar items specific to ResizableContainer here */}
      </div>
    ),
  },
};

// Example usage in a Craft.js environment
export const ExampleUsage = () => {
  return (
    <Editor resolver={{ ResizableContainer, Text }}>
      <Frame>
        <Element is={ResizableContainer} canvas>
          <Text text="This is some text inside the ResizableContainer" />
          <Element is={ResizableContainer} canvas>
            <Text text="Nested ResizableContainer with text" />
          </Element>
        </Element>
      </Frame>
    </Editor>
  );
};

// Simple Text component for demonstration
const Text = ({ text }) => {
  const { connectors: { connect } } = useNode();
  return <p ref={connect}>{text}</p>;
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Default text'
  },
};