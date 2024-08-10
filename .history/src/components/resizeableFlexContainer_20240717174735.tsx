import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const ResizableContainer = ({ children }) => {
  const { connectors: { connect } } = useNode();
  
  return (
    <div 
      ref={connect}
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
  const { id, connectors: { connect }, actions: { setProp } } = useNode();
  const [width, setWidth] = useState('33.33%');
  const itemRef = useRef(null);
  const { enabled, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    actions: state.actions
  }));

  const handleResize = useCallback((newWidth) => {
    setWidth(newWidth);
    setProp(props => props.width = newWidth);
  }, [setProp]);

  const handleDragStart = useCallback((e) => {
    if (e.target.closest('.resizer')) {
      e.stopPropagation();
      return;
    }
    actions.setNodeEvent('dragging', id);
  }, [actions, id]);

  const handleDrag = useCallback((e) => {
    if (e.target.closest('.resizer')) {
      return;
    }
    actions.move(id, e.movementX, e.movementY);
  }, [actions, id]);

  const handleDragEnd = useCallback(() => {
    actions.setNodeEvent('dragging', null);
  }, [actions]);

  useEffect(() => {
    if (!itemRef.current || !enabled) return;

    const element = itemRef.current;
    element.addEventListener('mousedown', handleDragStart);
    element.addEventListener('mousemove', handleDrag);
    element.addEventListener('mouseup', handleDragEnd);

    return () => {
      element.removeEventListener('mousedown', handleDragStart);
      element.removeEventListener('mousemove', handleDrag);
      element.removeEventListener('mouseup', handleDragEnd);
    };
  }, [enabled, handleDragStart, handleDrag, handleDragEnd]);

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
      e.stopPropagation();
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
      className="resizer"
      style={{
        width: '10px',
        position: 'absolute',
        right: '-5px',
        top: 0,
        bottom: 0,
        cursor: 'col-resize',
        backgroundColor: '#ddd',
        zIndex: 1000,
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