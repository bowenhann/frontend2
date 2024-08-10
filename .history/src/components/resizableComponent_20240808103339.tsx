import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = 'auto', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [minSize, setMinSize] = useState({ width: GRID_SIZE, height: GRID_SIZE });

  // 定义网格大小
  const GRID_SIZE = 30; // 每个格子的像素大小

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

  useEffect(() => {
    if (contentRef.current) {
      const updateMinSize = () => {
        const { scrollWidth, scrollHeight } = contentRef.current;
        setMinSize({
          width: Math.max(scrollWidth, GRID_SIZE),
          height: Math.max(scrollHeight, GRID_SIZE)
        });
      };
      updateMinSize();
      // 创建一个 ResizeObserver 来监听内容大小的变化
      const resizeObserver = new ResizeObserver(updateMinSize);
      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [children]);

  const getPixelValue = (value, dimension) => {
    if (typeof value === 'string' && value.endsWith('%')) {
      return (parseInt(value) / 100) * containerSize[dimension];
    }
    return parseInt(value) || (dimension === 'width' ? 100 : 50); // Default sizes
  };

  const pixelWidth = getPixelValue(width, 'width');
  const pixelHeight = getPixelValue(height, 'height');

  // 将像素值调整到最近的网格大小
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
          width={snapToGrid(Math.max(pixelWidth, minSize.width))}
          height={snapToGrid(Math.max(pixelHeight, minSize.height))}
          minConstraints={[snapToGrid(minSize.width), snapToGrid(minSize.height)]}
          maxConstraints={[snapToGrid(containerSize.width), snapToGrid(containerSize.height)]}
          onResize={(e, { size }) => {
            const snappedWidth = snapToGrid(Math.max(size.width, minSize.width));
            const snappedHeight = snapToGrid(Math.max(size.height, minSize.height));
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
            ref={ref => {
              connect(drag(ref));
              contentRef.current = ref;
            }}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              padding: '5px',
              boxSizing: 'border-box',
              overflow: 'auto'
            }}
          >
            {children}
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