import React from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = '100%', height = '100%', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();

  return (
    <ResizableBox
      width={parseInt(width)}
      height={parseInt(height)}
      onResize={(e, { size }) => {
        setProp(props => {
          props.width = `${size.width}%`;
          props.height = `${size.height}%`;
        });
      }}
      draggableOpts={{ grid: [25, 25] }}
    >
      <div 
        ref={ref => connect(drag(ref))}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #ccc',
          padding: '10px',
          margin: '5px',
          minHeight: '50px'
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
        Width (%):
        <input
          type="number"
          value={parseInt(width)}
          onChange={(e) => setProp(props => props.width = `${e.target.value}%`)}
        />
      </label>
      <label>
        Height (%):
        <input
          type="number"
          value={parseInt(height)}
          onChange={(e) => setProp(props => props.height = `${e.target.value}%`)}
        />
      </label>
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
