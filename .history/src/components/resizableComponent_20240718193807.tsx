import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 200, height: 100 });

  const onResize = (event, { size }) => {
    setSize({ width: size.width, height: size.height });
    setProp(props => {
      props.width = size.width;
      props.height = size.height;
    });
  };

  return (
    <div ref={containerRef} style={{ margin: '5px' }}>
      <ResizableBox
        width={size.width}
        height={size.height}
        onResize={onResize}
        minConstraints={[100, 50]}
        maxConstraints={[300, 200]}
      >
        <div 
          ref={ref => connect(drag(ref))}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #ccc',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          {children}
        </div>
      </ResizableBox>
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
          type="number"
          value={width}
          onChange={(e) => setProp(props => props.width = parseInt(e.target.value))}
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          value={height}
          onChange={(e) => setProp(props => props.height = parseInt(e.target.value))}
        />
      </label>
    </div>
  );
};

ResizableComponent.craft = {
  props: {
    width: 200,
    height: 100,
  },
  related: {
    toolbar: ResizableSettings,
  },
};