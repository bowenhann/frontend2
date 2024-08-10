import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';

const ResizableContainer = ({ children }) => {
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

const ResizableItem = ({ children }) => {
  const { id, connectors: { connect }, actions: { setProp } } = useNode();
  const { actions, query, isActive } = useEditor();
  const [width, setWidth] = useState('33.33%');
  const resizerRef = useRef(null);

  const startResize = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startWidth = resizerRef.current.parentElement.getBoundingClientRect().width;
    const containerWidth = resizerRef.current.parentElement.parentElement.getBoundingClientRect().width;

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const newWidth = ((startWidth + dx) / containerWidth) * 100;
      
      if (newWidth > 10 && newWidth < 90) {
        setWidth(`${newWidth}%`);
        setProp((props) => props.width = `${newWidth}%`);
        actions.setCustom(id, (custom) => custom.width = `${newWidth}%`);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      actions.clearEvents();
    };

    actions.setNodeEvent(id, 'mousemove', onMouseMove);
    actions.setNodeEvent(id, 'mouseup', onMouseUp);
  }, [id, actions, setProp]);

  useEffect(() => {
    if (resizerRef.current && isActive) {
      resizerRef.current.addEventListener('mousedown', startResize);
    }
    return () => {
      if (resizerRef.current) {
        resizerRef.current.removeEventListener('mousedown', startResize);
      }
    };
  }, [isActive, startResize]);

  return (
    <div
      ref={connect}
      style={{
        flex: `0 0 ${width}`,
        padding: '10px',
        backgroundColor: '#f0f0f0',
        position: 'relative'
      }}
    >
      {children}
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
    </div>
  );
};

ResizableContainer.craft = {
  displayName: 'Resizable Container',
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};

ResizableItem.craft = {
  displayName: 'Resizable Item',
  props: {
    width: '33.33%',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => false,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

export { ResizableContainer, ResizableItem };