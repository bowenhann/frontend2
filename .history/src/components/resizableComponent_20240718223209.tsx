import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = '150px', height = '50px', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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
    return parseInt(value) || (dimension === 'width' ? 150 : 50); // Default sizes
  };

  const pixelWidth = getPixelValue(width, 'width');
  const pixelHeight = getPixelValue(height, 'height');

  return (
    <ResizableBox
      width={pixelWidth}
      height={pixelHeight}
      minConstraints={[100, 30]} // Minimum size
      onResize={(e, { size }) => {
        setProp(props => {
          props.width = `${size.width}px`;
          props.height = `${size.height}px`;
        });
      }}
      resizeHandles={['se']} // Only allow resizing from the bottom-right corner
      style={{
        margin: '5px',
        display: 'inline-flex', // This allows components to be in the same line
        flexShrink: 0, // Prevent the component from shrinking
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
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
        }}
      >
        {children}
      </div>
    </ResizableBox>
  );
};



export const ResizableSettings = () => {
  const { actions: { setProp }, width, height } = useNode((node) => ({
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  return (
    <div>
      <label>
        Width:
        <input
          type="text"
          value={width}
          onChange={(e) => setProp(props => props.width = e.target.value)}
        />
      </label>
      <label>
        Height:
        <input
          type="text"
          value={height}
          onChange={(e) => setProp(props => props.height = e.target.value)}
        />
      </label>
      <p>Enter values as percentages (e.g., '50%') or pixels (e.g., '200').</p>
    </div>
  );
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