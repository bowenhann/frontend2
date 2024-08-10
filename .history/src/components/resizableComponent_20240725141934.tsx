import React, { useRef, useEffect, useState } from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = 'auto', height = 'auto', children, ...props }) => {
  const { connectors: { connect, drag }, actions: { setProp }, id } = useNode((node) => ({
    id: node.id,
  }));
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

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
    return parseInt(value) || (dimension === 'width' ? 100 : 50);
  };

  const pixelWidth = getPixelValue(width, 'width');
  const pixelHeight = getPixelValue(height, 'height');

  return (
    <ResizableBox
      width={pixelWidth}
      height={pixelHeight}
      minConstraints={[50, 30]}
      onResize={(e, { size }) => {
        setProp((props) => {
          props.width = `${size.width}px`;
          props.height = `${size.height}px`;
        });
      }}
      resizeHandles={['se']}
      draggableOpts={{ disabled: !enabled }}
    >
      <div
        {...props}
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
          position: 'relative',
        }}
      >
        {/* Wrapping children with Element to ensure they are editable */}
        <Element id={`${id}-canvas`} canvas is="div" style={{ height: '100%' }}>
          {children}
        </Element>
      </div>
    </ResizableBox>
  );
};

ResizableComponent.craft = {
  props: {
    width: '100%',
    height: '100%',
  },
  related: {
    toolbar: () => null, // You can add a custom toolbar component here if needed
  },
};

// Helper HOC to make any component draggable within Craft.js
export const Draggable = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref))}>{children}</div>
  );
};