import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ width = 'auto', height = 'auto', children }) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [componentSize, setComponentSize] = useState({ width: 0, height: 0 });

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

  useEffect(() => {
    setComponentSize({
      width: getPixelValue(width, 'width'),
      height: getPixelValue(height, 'height'),
    });
  }, [width, height, containerSize]);

  const getPixelValue = (value, dimension) => {
    if (typeof value === 'string' && value.endsWith('%')) {
      return (parseInt(value) / 100) * containerSize[dimension];
    }
    return parseInt(value) || (dimension === 'width' ? 100 : 50); // Default sizes
  };

  const onResize = (event, { size }) => {
    setComponentSize(size);
    setProp(props => {
      props.width = `${size.width}px`;
      props.height = `${size.height}px`;
    });
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        display: 'inline-flex',
        flexDirection: 'column',
        margin: '5px',
        maxWidth: '100%',
      }}
    >
      {containerSize.width > 0 && containerSize.height > 0 && (
        <Resizable
          width={componentSize.width}
          height={componentSize.height}
          onResize={onResize}
          minConstraints={[50, 30]}
          maxConstraints={[containerSize.width, containerSize.height]}
          handle={<div className="react-resizable-handle react-resizable-handle-se" />}
        >
          <div 
            ref={ref => connect(drag(ref))}
            style={{
              width: `${componentSize.width}px`,
              height: `${componentSize.height}px`,
              border: '1px solid #ccc',
              padding: '5px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              display: 'inline-flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>
        </Resizable>
      )}
    </div>
  );
};

// ResizableSettings component remains the same
export const ResizableSettings = () => {
  // ... (unchanged)
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