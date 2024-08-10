import React, { useRef, useEffect, useState } from 'react';
import { useNode, UserComponent } from '@craftjs/core';

export const ResizableFlexContainer: UserComponent<{
  children: React.ReactNode;
  backgroundColor?: string;
}> = ({ children, backgroundColor = '#f0f0f0' }) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidths, setItemWidths] = useState<number[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      const childCount = containerRef.current.children.length;
      setItemWidths(new Array(childCount).fill(100 / childCount));
    }
  }, [children]);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidths = [...itemWidths];

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const deltaPercentage = (deltaX / containerWidth) * 100;

      const newWidths = [...startWidths];
      newWidths[index] += deltaPercentage;
      newWidths[index + 1] -= deltaPercentage;

      // Ensure widths don't go below 10%
      if (newWidths[index] < 10) newWidths[index] = 10;
      if (newWidths[index + 1] < 10) newWidths[index + 1] = 10;

      setItemWidths(newWidths);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '100px',
        border: `2px solid ${selected ? 'blue' : 'transparent'}`,
        backgroundColor,
      }}
    >
      <div ref={containerRef} style={{ display: 'flex', width: '100%' }}>
        {React.Children.map(children, (child, index) => (
          <>
            <div style={{ flex: `0 0 ${itemWidths[index]}%` }}>{child}</div>
            {index < React.Children.count(children) - 1 && (
              <div
                style={{
                  width: '10px',
                  backgroundColor: '#ddd',
                  cursor: 'col-resize',
                }}
                onMouseDown={handleMouseDown(index)}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

ResizableFlexContainer.craft = {
  props: {
    backgroundColor: '#f0f0f0',
  },
  related: {
    settings: [
      {
        name: 'Background Color',
        key: 'backgroundColor',
        type: 'color',
      },
    ],
  },
};

// Example of a simple content component to be used inside the ResizableFlexContainer
export const FlexItem: UserComponent<{ content: string; backgroundColor?: string }> = ({
  content,
  backgroundColor = '#ffffff',
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      ref={connect}
      style={{
        padding: '10px',
        backgroundColor,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
};

FlexItem.craft = {
  props: {
    content: 'Flex Item',
    backgroundColor: '#ffffff',
  },
  related: {
    settings: [
      {
        name: 'Content',
        key: 'content',
        type: 'text',
      },
      {
        name: 'Background Color',
        key: 'backgroundColor',
        type: 'color',
      },
    ],
  },
};