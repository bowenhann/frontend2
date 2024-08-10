import React, { useRef, useEffect, useState } from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = 'auto', height = 'auto', children, ...props }) => {
  const { connectors: { connect, drag }, actions: { setProp }, id } = useNode((node) => ({
    isCanvas: node.data.props.canvas
  }));
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  
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
    <div 
      ref={(ref) => {
        containerRef.current = ref;
        connect(drag(ref));
      }}
      style={{ 
        display: 'inline-flex',
        flexDirection: 'column',
        margin: '5px',
        maxWidth: '100%',
      }}
    >
      {containerSize.width > 0 && containerSize.height > 0 && (
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
            <Element id={`${id}-canvas`} canvas is="div" {...props}>
              {children}
            </Element>
          </div>
        </ResizableBox>
      )}
    </div>
  );
};

ResizableComponent.craft = {
  props: {
    width: '100%',
    height: '100%',
    background: '#ffffff',
  },
  related: {
    settings: ResizableComponentSettings,
  },
};

export const ResizableComponentSettings = () => {
  const { actions: { setProp }, width, height, background } = useNode((node) => ({
    width: node.data.props.width,
    height: node.data.props.height,
    background: node.data.props.background,
  }));

  return (
    <div>
      <h4>Resizable Component Settings</h4>
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
      <label>
        Background:
        <input
          type="color"
          value={background}
          onChange={(e) => setProp((props) => (props.background = e.target.value))}
        />
      </label>
    </div>
  );
};