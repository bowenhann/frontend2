import React, { useRef, useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';

// Resizer component
const Resizer = ({ onResize }) => {
  const resizerRef = useRef(null);
  const { connectors: { connect } } = useNode((node) => ({
    selected: node.events.selected,
  }));

  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    let x = 0;
    let w = 0;

    const mouseDownHandler = (e) => {
      x = e.clientX;
      const styles = window.getComputedStyle(resizer.parentNode);
      w = parseInt(styles.width, 10);

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e) => {
      const dx = e.clientX - x;
      onResize(w + dx);
      e.stopPropagation();
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);

    return () => {
      resizer.removeEventListener('mousedown', mouseDownHandler);
    };
  }, [onResize]);

  return (
    <div
      ref={(dom) => {
        if (dom) {
          resizerRef.current = dom;
          connect(dom);
        }
      }}
      className="resizer"
      style={{
        width: '10px',
        backgroundColor: '#ddd',
        cursor: 'col-resize',
      }}
    />
  );
};

// FlexContainer component
export const FlexContainer = ({ children }) => {
  const { connectors: { connect } } = useNode();
  const containerRef = useRef(null);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    if (containerRef.current) {
      const childCount = React.Children.count(children);
      const initialSize = 100 / childCount;
      setSizes(new Array(childCount).fill(initialSize));
    }
  }, [children]);

  const handleResize = (index, newSize) => {
    setSizes(prevSizes => {
      const newSizes = [...prevSizes];
      const diff = newSize - newSizes[index];
      newSizes[index] = newSize;
      newSizes[index + 1] -= diff;
      return newSizes;
    });
  };

  return (
    <div
      ref={(dom) => {
        if (dom) {
          containerRef.current = dom;
          connect(dom);
        }
      }}
      style={{
        display: 'flex',
        width: '100%',
        height: '200px',
        border: '1px solid #ccc',
      }}
    >
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          <div style={{ flex: `0 0 ${sizes[index]}%` }}>
            {child}
          </div>
          {index < React.Children.count(children) - 1 && (
            <Resizer onResize={(newSize) => handleResize(index, newSize)} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// FlexItem component
export const FlexItem = ({ children }) => {
  const { connectors: { connect } } = useNode();

  return (
    <div
      ref={connect}
      style={{
        height: '100%',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
};

FlexContainer.craft = {
  displayName: 'Flex Container',
  props: {},
  rules: {
    canDrag: () => true,
  },
};

FlexItem.craft = {
  displayName: 'Flex Item',
  props: {},
  rules: {
    canDrag: () => true,
  },
};