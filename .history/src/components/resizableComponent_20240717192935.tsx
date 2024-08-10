import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width, height, children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current.parentElement;
      setContainerSize({ width: offsetWidth, height: offsetHeight });
      if (!width) setProp(props => props.width = offsetWidth);
      if (!height) setProp(props => props.height = offsetHeight);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <ResizableBox
        width={width || containerSize.width}
        height={height || containerSize.height}
        onResize={(e, { size }) => {
          setProp(props => {
            props.width = size.width;
            props.height = size.height;
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
    </div>
  );
};

ResizableComponent.craft = {
  props: {
    width: undefined,
    height: undefined,
  },
  related: {
    settings: ResizableSettings,
  },
};

export const ResizableSettings = () => {
  const { actions: { setProp }, width, height } = useNode((node) => ({
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  return (
    <div>
      <label>
        Width (px):
        <input
          type="number"
          value={width}
          onChange={(e) => setProp(props => props.width = parseInt(e.target.value))}
        />
      </label>
      <label>
        Height (px):
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
    width: '100%',
    height: '100%',
  },
  related: {
    toolbar: ResizableSettings,
  },
};
