import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = '100px', height = '100px', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const [size, setSize] = useState({ width: parseInt(width), height: parseInt(height) });

  useEffect(() => {
    setSize({
      width: typeof width === 'string' ? parseInt(width) : width,
      height: typeof height === 'string' ? parseInt(height) : height
    });
  }, [width, height]);

  return (
    <ResizableBox
      width={size.width}
      height={size.height}
      onResize={(e, { size }) => {
        setSize(size);
        setProp(props => {
          props.width = `${size.width}px`;
          props.height = `${size.height}px`;
        });
      }}
      minConstraints={[50, 50]}
      style={{
        display: 'inline-block',
        verticalAlign: 'top',
        margin: '5px'
      }}
    >
      <div 
        ref={ref => connect(drag(ref))}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #ccc',
          padding: '10px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </ResizableBox>
  );
};

// ResizableSettings 组件保持不变

ResizableComponent.craft = {
  props: {
    width: '100px',
    height: '100px',
  },
  related: {
    toolbar: ResizableSettings,
  },
};