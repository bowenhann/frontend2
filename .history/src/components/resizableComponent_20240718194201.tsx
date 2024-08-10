import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableComponent = ({ 
  width = '100%', 
  height = '100%', 
  minWidth = '100px',
  maxWidth = '100%',
  flexGrow = 1,
  flexShrink = 1,
  flexBasis = 'auto',
  margin = '5px',
  children 
}) => {
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
    return parseInt(value);
  };

  const pixelWidth = getPixelValue(width, 'width');
  const pixelHeight = getPixelValue(height, 'height');

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        minWidth,
        maxWidth,
        margin,
        flex: `${flexGrow} ${flexShrink} ${flexBasis}`,
      }}
    >
      {containerSize.width > 0 && containerSize.height > 0 && (
        <ResizableBox
          width={pixelWidth}
          height={pixelHeight}
          minConstraints={[parseInt(minWidth), 50]}
          maxConstraints={[getPixelValue(maxWidth, 'width'), Infinity]}
          onResize={(e, { size }) => {
            const newWidth = `${Math.round((size.width / containerSize.width) * 100)}%`;
            const newHeight = `${Math.round((size.height / containerSize.height) * 100)}%`;
            setProp(props => {
              props.width = newWidth;
              props.height = newHeight;
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'auto'
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
  const { actions: { setProp }, width, height, minWidth, maxWidth, flexGrow, flexShrink, flexBasis, margin } = useNode((node) => ({
    width: node.data.props.width,
    height: node.data.props.height,
    minWidth: node.data.props.minWidth,
    maxWidth: node.data.props.maxWidth,
    flexGrow: node.data.props.flexGrow,
    flexShrink: node.data.props.flexShrink,
    flexBasis: node.data.props.flexBasis,
    margin: node.data.props.margin,
  }));

  return (
    <div>
      <label>
        Width: <input type="text" value={width} onChange={(e) => setProp(props => props.width = e.target.value)} />
      </label>
      <label>
        Height: <input type="text" value={height} onChange={(e) => setProp(props => props.height = e.target.value)} />
      </label>
      <label>
        Min Width: <input type="text" value={minWidth} onChange={(e) => setProp(props => props.minWidth = e.target.value)} />
      </label>
      <label>
        Max Width: <input type="text" value={maxWidth} onChange={(e) => setProp(props => props.maxWidth = e.target.value)} />
      </label>
      <label>
        Flex Grow: <input type="number" value={flexGrow} onChange={(e) => setProp(props => props.flexGrow = parseFloat(e.target.value))} />
      </label>
      <label>
        Flex Shrink: <input type="number" value={flexShrink} onChange={(e) => setProp(props => props.flexShrink = parseFloat(e.target.value))} />
      </label>
      <label>
        Flex Basis: <input type="text" value={flexBasis} onChange={(e) => setProp(props => props.flexBasis = e.target.value)} />
      </label>
      <label>
        Margin: <input type="text" value={margin} onChange={(e) => setProp(props => props.margin = e.target.value)} />
      </label>
      <p>Enter values as percentages (e.g., '50%') or pixels (e.g., '200px').</p>
    </div>
  );
};

ResizableComponent.craft = {
  props: {
    width: '100%',
    height: '100%',
    minWidth: '100px',
    maxWidth: '100%',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    margin: '5px',
  },
  related: {
    toolbar: ResizableSettings,
  },
};