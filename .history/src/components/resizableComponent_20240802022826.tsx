import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import 'react-resizable/css/styles.css';

const GRID_SIZE = 20;

const ResizeHandle = ({ position, onMouseDown }) => (
  <div
    className={`resize-handle ${position}`}
    onMouseDown={onMouseDown}
    style={{
      position: 'absolute',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      zIndex: 1000,
      cursor: position.includes('left') || position.includes('right') ? 'ew-resize' : 'ns-resize',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '14px',
    }}
  >
    {position === 'left' && '←'}
    {position === 'right' && '→'}
    {position === 'top' && '↑'}
    {position === 'bottom' && '↓'}
  </div>
);

export const ResizableComponent = ({ width = 'auto', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [showHandles, setShowHandles] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const { offsetWidth, offsetHeight } = containerRef.current.parentElement;
        setContainerSize({ width: offsetWidth, height: offsetHeight });
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  const getPixelValue = (value, dimension) => {
    if (typeof value === 'string' && value.endsWith('%')) {
      return (parseInt(value) / 100) * containerSize[dimension];
    }
    return parseInt(value) || (dimension === 'width' ? 100 : 50);
  };

  const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const pixelWidth = snapToGrid(getPixelValue(width, 'width'));
  const pixelHeight = snapToGrid(getPixelValue(height, 'height'));

  const handleResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = pixelWidth;
    const startHeight = pixelHeight;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) {
        newWidth = snapToGrid(startWidth + deltaX);
      } else if (direction.includes('left')) {
        newWidth = snapToGrid(startWidth - deltaX);
      }

      if (direction.includes('bottom')) {
        newHeight = snapToGrid(startHeight + deltaY);
      } else if (direction.includes('top')) {
        newHeight = snapToGrid(startHeight - deltaY);
      }

      newWidth = Math.max(GRID_SIZE, Math.min(newWidth, snapToGrid(containerSize.width)));
      newHeight = Math.max(GRID_SIZE, Math.min(newHeight, snapToGrid(containerSize.height)));

      setProp(props => {
        props.width = `${newWidth}px`;
        props.height = `${newHeight}px`;
      });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '5px',
        maxWidth: '100%',
        position: 'relative',
      }}
      onMouseEnter={() => setShowHandles(true)}
      onMouseLeave={() => !isResizing && setShowHandles(false)}
    >
      <div
        ref={ref => connect(drag(ref))}
        style={{
          width: `${pixelWidth}px`,
          height: `${pixelHeight}px`,
          border: '1px solid #ccc',
          padding: '5px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
      {showHandles && (
        <>
          <ResizeHandle position="left" onMouseDown={(e) => handleResize(e, 'left')} />
          <ResizeHandle position="right" onMouseDown={(e) => handleResize(e, 'right')} />
          <ResizeHandle position="top" onMouseDown={(e) => handleResize(e, 'top')} />
          <ResizeHandle position="bottom" onMouseDown={(e) => handleResize(e, 'bottom')} />
        </>
      )}
    </div>
  );
};

// ResizableSettings component remains the same
export const ResizableSettings = () => {
  // ... (unchanged)
};

ResizableComponent.craft = {
  props: {
    width: '100%',
    height: '100%',
  },
  related: {
    toolbar: ResizableSettings,
  },
};