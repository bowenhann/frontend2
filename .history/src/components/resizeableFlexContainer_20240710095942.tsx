import React, { useRef, useEffect, useState } from 'react';
import { useNode, UserComponent } from '@craftjs/core';

// Resizer Component
const Resizer = ({ id }) => {
  const { connectors: { connect } } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <div
      ref={connect}
      id={id}
      className="resizer"
      style={{
        width: '10px',
        backgroundColor: '#ddd',
        cursor: 'col-resize',
      }}
    />
  );
};

Resizer.craft = {
  props: {},
  rules: {
    canDrag: () => false,
  },
};

// FlexItem Component
const FlexItem = ({ children, width }) => {
  const { connectors: { connect } } = useNode();

  return (
    <div
      ref={connect}
      className="flex-item"
      style={{
        flex: `0 0 ${width}%`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRight: '1px solid #ccc',
      }}
    >
      {children}
    </div>
  );
};

FlexItem.craft = {
  props: {
    width: 33.33,
  },
  rules: {
    canDrag: () => false,
  },
};

// FlexContainer Component
export const FlexContainer: UserComponent = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const { connectors: { connect } } = useNode();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizers = container.querySelectorAll('.resizer');
    const items = container.querySelectorAll('.flex-item');

    const makeResizable = (resizer: Element, index: number) => {
      let x = 0;
      let leftWidth = 0;
      let rightWidth = 0;

      const mouseDownHandler = function(e: MouseEvent) {
        x = e.clientX;
        const leftItem = items[index] as HTMLElement;
        const rightItem = items[index + 1] as HTMLElement;
        leftWidth = leftItem.getBoundingClientRect().width;
        rightWidth = rightItem.getBoundingClientRect().width;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      };

      const mouseMoveHandler = function(e: MouseEvent) {
        const dx = e.clientX - x;
        const containerWidth = container.getBoundingClientRect().width;
        const newLeftWidth = ((leftWidth + dx) / containerWidth) * 100;
        const newRightWidth = ((rightWidth - dx) / containerWidth) * 100;

        setItemWidths(prev => {
          const newWidths = [...prev];
          newWidths[index] = newLeftWidth;
          newWidths[index + 1] = newRightWidth;
          return newWidths;
        });
      };

      const mouseUpHandler = function() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      resizer.addEventListener('mousedown', mouseDownHandler);
    };

    resizers.forEach((resizer, index) => makeResizable(resizer, index));

    return () => {
      resizers.forEach(resizer => {
        resizer.removeEventListener('mousedown', () => {});
      });
    };
  }, []);

  useEffect(() => {
    if (children && Array.isArray(children)) {
      setItemWidths(new Array(Math.ceil(children.length / 2)).fill(100 / (children.length / 2)));
    }
  }, [children]);

  return (
    <div
      ref={(ref) => {
        connect(ref);
        containerRef.current = ref;
      }}
      style={{
        display: 'flex',
        width: '100%',
        height: '200px',
        border: '1px solid #ccc',
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (index % 2 === 0) {
          return React.cloneElement(child as React.ReactElement, {
            width: itemWidths[Math.floor(index / 2)] || 100 / (children.length / 2),
          });
        }
        return child;
      })}
    </div>
  );
};

FlexContainer.craft = {
  props: {},
  rules: {
    canDrag: () => false,
  },
};

// Usage Example
export const ResizableFlexLayout = () => {
  return (
    <FlexContainer>
      <FlexItem>Item 1</FlexItem>
      <Resizer id="resizer1" />
      <FlexItem>Item 2</FlexItem>
      <Resizer id="resizer2" />
      <FlexItem>Item 3</FlexItem>
    </FlexContainer>
  );
};

ResizableFlexLayout.craft = {
  props: {},
  rules: {
    canDrag: () => true,
  },
};