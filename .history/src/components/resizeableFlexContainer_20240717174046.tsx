import React, { useRef, useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const ResizableContainer = ({ children }) => {
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
  const { connectors: { connect }, actions: { setProp } } = useNode();
  const [width, setWidth] = useState('33.33%');
  const itemRef = useRef(null);

  const handleResize = (newWidth) => {
    setWidth(newWidth);
    setProp(props => props.width = newWidth);
  };

  return (
    <div
      ref={(ref) => {
        itemRef.current = ref;
        connect(ref);
      }}
      style={{
        flex: `0 0 ${width}`,
        padding: '10px',
        backgroundColor: '#f0f0f0',
        position: 'relative'
      }}
    >
      {children}
      <Resizer 
        parentRef={itemRef}
        onResize={handleResize}
      />
    </div>
  );
};

const Resizer = ({ parentRef, onResize }) => {
  const resizerRef = useRef(null);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  useEffect(() => {
    const resizer = resizerRef.current;
    const parentElement = parentRef.current;
    if (!resizer || !parentElement || !enabled) return;

    let startX, startWidth, nextElementStartWidth;

    const onMouseDown = (e) => {
      e.stopPropagation(); // Prevent Craft.js drag from triggering
      startX = e.clientX;
      const rect = parentElement.getBoundingClientRect();
      startWidth = rect.width;
      if (parentElement.nextElementSibling) {
        nextElementStartWidth = parentElement.nextElementSibling.getBoundingClientRect().width;
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const containerWidth = parentElement.parentNode.getBoundingClientRect().width;
      const newWidth = ((startWidth + dx) / containerWidth) * 100;
      const nextElementNewWidth = nextElementStartWidth ? ((nextElementStartWidth - dx) / containerWidth) * 100 : 0;
      
      if (newWidth > 10 && (!nextElementStartWidth || nextElementNewWidth > 10)) {
        onResize(`${newWidth}%`);
        if (parentElement.nextElementSibling) {
          parentElement.nextElementSibling.style.flex = `0 0 ${nextElementNewWidth}%`;
        }
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizer.addEventListener('mousedown', onMouseDown);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
    };
  }, [enabled, onResize, parentRef]);

  if (!enabled) return null;

  return (
    <div
      ref={resizerRef}
      style={{
        width: '10px',
        position: 'absolute',
        right: '-5px',
        top: 0,
        bottom: 0,
        cursor: 'col-resize',
        backgroundColor: '#ddd'
      }}
    />
  );
};

ResizableContainer.craft = {
  displayName: 'Resizable Container',
};

ResizableItem.craft = {
  displayName: 'Resizable Item',
  props: {
    width: '33.33%',
  },
  related: {
    toolbar: () => (
      <div>
        {/* Add any toolbar items specific to ResizableItem here */}
      </div>
    ),
  },
};