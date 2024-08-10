import React, { useRef, useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 20;
const BUTTON_SIZE = 24;

export const ResizableComponent = ({ width = 'auto', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);

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

  const pixelWidth = getPixelValue(width, 'width');
  const pixelHeight = getPixelValue(height, 'height');

  const snapToGrid = (value) => Math.max(GRID_SIZE, Math.round(value / GRID_SIZE) * GRID_SIZE);

  const handleResizeStart = (direction) => (e) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResize = (e) => {
    if (!isResizing) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    let newWidth = pixelWidth;
    let newHeight = pixelHeight;

    switch (resizeDirection) {
      case 'right':
        newWidth = snapToGrid(e.clientX - containerRect.left);
        break;
      case 'bottom':
        newHeight = snapToGrid(e.clientY - containerRect.top);
        break;
      case 'left':
        newWidth = snapToGrid(containerRect.right - e.clientX);
        break;
      case 'top':
        newHeight = snapToGrid(containerRect.bottom - e.clientY);
        break;
    }

    setProp((props) => {
      props.width = `${newWidth}px`;
      props.height = `${newHeight}px`;
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection(null);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  const ResizeButton = ({ direction, style }) => (
    <div
      style={{
        position: 'absolute',
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '50%',
        cursor: 'pointer',
        ...style,
      }}
      onMouseDown={handleResizeStart(direction)}
    >
      {direction === 'top' && <ChevronUp size={16} />}
      {direction === 'bottom' && <ChevronDown size={16} />}
      {direction === 'left' && <ChevronLeft size={16} />}
      {direction === 'right' && <ChevronRight size={16} />}
    </div>
  );

  return (
    <div 
      ref={(ref) => {
        containerRef.current = ref;
        connect(drag(ref));
      }}
      style={{ 
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '5px',
        width: `${pixelWidth}px`,
        height: `${pixelHeight}px`,
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '5px' }}>{children}</div>
      <ResizeButton direction="right" style={{ top: '50%', right: -BUTTON_SIZE/2, transform: 'translateY(-50%)' }} />
      <ResizeButton direction="bottom" style={{ bottom: -BUTTON_SIZE/2, left: '50%', transform: 'translateX(-50%)' }} />
      <ResizeButton direction="left" style={{ top: '50%', left: -BUTTON_SIZE/2, transform: 'translateY(-50%)' }} />
      <ResizeButton direction="top" style={{ top: -BUTTON_SIZE/2, left: '50%', transform: 'translateX(-50%)' }} />
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