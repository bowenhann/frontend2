import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = 'auto', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

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
      const updateContentSize = () => {
        const { scrollWidth, scrollHeight } = contentRef.current;
        setContentSize({ width: scrollWidth, height: scrollHeight });
      };
      updateContentSize();
      // 创建一个 ResizeObserver 来监听内容大小的变化
      const resizeObserver = new ResizeObserver(updateContentSize);
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

  // 确保最小尺寸不小于内容尺寸，并且符合网格大小
  const minWidth = Math.max(snapToGrid(contentSize.width), GRID_SIZE);
  const minHeight = Math.max(snapToGrid(contentSize.height), GRID_SIZE);

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
          width={snapToGrid(Math.max(pixelWidth, minWidth))}
          height={snapToGrid(Math.max(pixelHeight, minHeight))}
          minConstraints={[minWidth, minHeight]}
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