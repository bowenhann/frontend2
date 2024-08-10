import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { Resizable } from 're-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = '100%', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const { offsetWidth, offsetHeight } = containerRef.current;
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
    return value === 'auto' ? 'auto' : parseInt(value);
  };

  const pixelWidth = getPixelValue(width, 'width');
  const pixelHeight = getPixelValue(height, 'height');

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {containerSize.width > 0 && (
        <Resizable
          size={{ width: pixelWidth, height: pixelHeight }}
          onResizeStop={(e, direction, ref, d) => {
            const newWidth = pixelWidth + d.width;
            const newHeight = pixelHeight + d.height;
            setProp(props => {
              props.width = `${Math.round((newWidth / containerSize.width) * 100)}%`;
              props.height = newHeight === 'auto' ? 'auto' : `${newHeight}px`;
            });
          }}
          enable={{ top: false, right: true, bottom: true, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
        >
          <div 
            ref={ref => connect(drag(ref))}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              padding: '10px',
              boxSizing: 'border-box',
              minHeight: '50px'
            }}
          >
            {children}
          </div>
        </Resizable>
      )}
    </div>
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
      <p>Enter values as percentages (e.g., '50%'), pixels (e.g., '200px'), or 'auto' for height.</p>
    </div>
  );
};