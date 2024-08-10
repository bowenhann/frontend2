import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag }, nodeProps, actions: { setProp } } = useNode((node) => ({
    nodeProps: node.data.props
  }));
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({
      width: parseSize(nodeProps.width) || 100,
      height: parseSize(nodeProps.height) || 50
    });
  }, [nodeProps.width, nodeProps.height]);

  const parseSize = (size) => {
    if (typeof size === 'number') return size;
    if (typeof size === 'string') {
      if (size.endsWith('px')) return parseInt(size);
      if (size.endsWith('%')) return parseFloat(size) / 100 * (size.includes('width') ? window.innerWidth : window.innerHeight);
    }
    return null;
  };

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        width: nodeProps.width,
        height: nodeProps.height,
        display: 'inline-block',
        position: 'relative',
        margin: '5px'
      }}
    >
      <ResizableBox
        width={size.width}
        height={size.height}
        onResize={(e, { size }) => {
          setSize(size);
          setProp((props) => {
            props.width = `${size.width}px`;
            props.height = `${size.height}px`;
          });
        }}
        resizeHandles={['se']}
        handle={<div className="custom-handle" />}
      >
        <div style={{
          width: '100%',
          height: '100%',
          border: '1px solid #ccc',
          padding: '5px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
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
          type="text"
          value={width}
          onChange={(e) => setProp((props) => props.width = e.target.value)}
        />
      </label>
      <label>
        Height:
        <input
          type="text"
          value={height}
          onChange={(e) => setProp((props) => props.height = e.target.value)}
        />
      </label>
    </div>
  );
};

ResizableComponent.craft = {
  props: {
    width: '100px',
    height: '50px',
  },
  related: {
    toolbar: ResizableSettings,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};