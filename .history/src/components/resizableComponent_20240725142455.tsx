import React, { useRef, useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { withNode } from '@/components/node/connector';
import { useNode } from '@craftjs/core';
import { SettingsControl } from '@/components/settings-control';
import 'react-resizable/css/styles.css';

const ResizableComponentInner = ({ width = 'auto', height = 'auto', children, className, ...props }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
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
      className={className}
      style={{ 
        display: 'inline-flex',
        flexDirection: 'column',
        margin: '5px',
        maxWidth: '100%',
      }}
      {...props}
    >
      {containerSize.width > 0 && containerSize.height > 0 && (
        <ResizableBox
          width={pixelWidth}
          height={pixelHeight}
          minConstraints={[50, 30]}
          onResize={(e, { size }) => {
            setProp(props => {
              props.width = `${size.width}px`;
              props.height = `${size.height}px`;
            });
          }}
          resizeHandles={['se']}
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
            {children}
          </div>
        </ResizableBox>
      )}
    </div>
  );
};

export const ResizableComponent = withNode(ResizableComponentInner, {
  draggable: true,
  canvas: true,
});

(ResizableComponent as any).craft = {
  props: {
    width: '100%',
    height: '100%',
    background: '#ffffff',
  },
  related: {
    toolbar: SettingsControl,
  },
};