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
  const [isResizing, setIsResizing] = useState(false);
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
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
      {isResizing && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

const Resizer = ({ parentRef, onResize, onResizeStart, onResizeEnd }) => {
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
      e.preventDefault();
      e.stopPropagation();
      startX = e.clientX;
      const rect = parentElement.getBoundingClientRect();
      startWidth = rect.width;
      if (parentElement.nextElementSibling) {
        nextElementStartWidth = parentElement.nextElementSibling.getBoundingClientRect().width;
      }
      onResizeStart();
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
      onResizeEnd();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizer.addEventListener('mousedown', onMouseDown);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
    };
  }, [enabled, onResize, onResizeStart, onResizeEnd, parentRef]);

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
        backgroundColor: '#ddd',
        zIndex: 1001,
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