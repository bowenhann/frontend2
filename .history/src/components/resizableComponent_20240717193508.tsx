import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ children }) => {
  const { connectors: { connect, drag }, actions: { setProp }, width, height } = useNode((node) => ({
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setContainerSize({ width: offsetWidth, height: offsetHeight });
      setProp(props => {
        props.width = offsetWidth;
        props.height = offsetHeight;
      });
    }
  }, [setProp]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {containerSize.width > 0 && containerSize.height > 0 && (
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
    width: undefined,
    height: undefined,
  },
  related: {
    settings: ResizableSettings,
  },
};
