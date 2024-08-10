import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = '30%', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [componentSize, setComponentSize] = useState({ width, height });

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
    return parseInt(value) || (dimension === 'width' ? 100 : 50); // Default sizes
  };

  const pixelWidth = getPixelValue(componentSize.width, 'width');
  const pixelHeight = getPixelValue(componentSize.height, 'height');

  return (
    <Resizable
      width={pixelWidth}
      height={pixelHeight}
      minConstraints={[50, 30]} // Minimum size
      onResize={(e, { size }) => {
        const newWidth = `${(size.width / containerSize.width) * 100}%`;
        const newHeight = size.height;
        setComponentSize({ width: newWidth, height: newHeight });
        setProp(props => {
          props.width = newWidth;
          props.height = `${newHeight}px`;
        });
      }}
      resizeHandles={['se']} // Only allow resizing from the bottom-right corner
    >
      <div 
        ref={(ref) => {
          containerRef.current = ref;
          connect(drag(ref));
        }}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #ccc',
          padding: '5px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'inline-flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </Resizable>
  );
};

// ResizableSettings component remains the same
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
          onChange={(e) => setProp((props) => (props.width = e.target.value))}
        />
      </label>
      <label>
        Height:
        <input
          type="text"
          value={height}
          onChange={(e) => setProp((props) => (props.height = e.target.value))}
        />
      </label>
    </div>
  );
};

ResizableComponent.craft = {
  props: {
    width: '30%',
    height: 'auto',
  },
  related: {
    toolbar: ResizableSettings,
  },
};