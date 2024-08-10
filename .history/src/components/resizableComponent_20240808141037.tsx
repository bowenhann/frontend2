import React, { useRef, useEffect, useState } from 'react';
import { useNode, Element } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = 'auto', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const GRID_SIZE = 30;

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

  const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '5px',
        maxWidth: '100%',
      }}
    >
      {containerSize.width > 0 && containerSize.height > 0 && (
        <ResizableBox
          width={snapToGrid(pixelWidth)}
          height={snapToGrid(pixelHeight)}
          minConstraints={[GRID_SIZE, GRID_SIZE]}
          maxConstraints={[snapToGrid(containerSize.width), snapToGrid(containerSize.height)]}
          onResize={(e, { size }) => {
            const snappedWidth = snapToGrid(size.width);
            const snappedHeight = snapToGrid(size.height);
            setProp(props => {
              props.width = `${snappedWidth}px`;
              props.height = `${snappedHeight}px`;
            });
          }}
          resizeHandles={['se']}
          draggableOpts={{
            grid: [GRID_SIZE, GRID_SIZE],
          }}
        >
          <div 
            ref={ref => connect(drag(ref))}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              padding: '5px',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            <Element canvas is="div" style={{ height: '100%' }}>
              {children}
            </Element>
          </div>
        </ResizableBox>
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