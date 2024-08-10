import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const ResizableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [itemWidths, setItemWidths] = useState<string[]>([]);

  const updateItemWidth = useCallback((index: number, newWidth: string) => {
    setItemWidths(prev => {
      const newWidths = [...prev];
      newWidths[index] = newWidth;
      return newWidths;
    });
  }, []);

  const childrenWithSeparators = React.Children.toArray(children).reduce((acc: React.ReactNode[], child, index, array) => {
    if (index === array.length - 1) {
      return [...acc, React.cloneElement(child as React.ReactElement, { width: itemWidths[index] || '33.33%' })];
    }
    return [
      ...acc,
      React.cloneElement(child as React.ReactElement, { width: itemWidths[index] || '33.33%' }),
      <Separator key={`separator-${index}`} leftIndex={index} rightIndex={index + 1} updateItemWidth={updateItemWidth} />
    ];
  }, []);

  return (
    <div 
      ref={ref => connect(drag(ref))} 
      style={{ 
        display: 'flex', 
        width: '100%', 
        minHeight: '100px',
        border: '1px solid #ccc',
        position: 'relative'
      }}
    >
      {childrenWithSeparators}
    </div>
  );
};

export const ResizableItem: React.FC<{ children: React.ReactNode; width: string }> = ({ children, width }) => {
  const { connectors: { connect } } = useNode();

  return (
    <div
      ref={connect}
      style={{
        flex: `0 0 ${width}`,
        padding: '10px',
        backgroundColor: '#f0f0f0',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

interface SeparatorProps {
  leftIndex: number;
  rightIndex: number;
  updateItemWidth: (index: number, newWidth: string) => void;
}

const Separator: React.FC<SeparatorProps> = ({ leftIndex, rightIndex, updateItemWidth }) => {
  const separatorRef = useRef<HTMLDivElement>(null);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  useEffect(() => {
    const separator = separatorRef.current;
    if (!separator || !enabled) return;

    let startX: number, leftStartWidth: number, rightStartWidth: number;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startX = e.clientX;
      const leftElement = separator.previousElementSibling as HTMLElement;
      const rightElement = separator.nextElementSibling as HTMLElement;
      if (leftElement && rightElement) {
        leftStartWidth = leftElement.getBoundingClientRect().width;
        rightStartWidth = rightElement.getBoundingClientRect().width;
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const container = separator.parentElement;
      if (!container) return;
      
      const dx = e.clientX - startX;
      const containerWidth = container.getBoundingClientRect().width;
      const newLeftWidth = ((leftStartWidth + dx) / containerWidth) * 100;
      const newRightWidth = ((rightStartWidth - dx) / containerWidth) * 100;
      
      if (newLeftWidth > 10 && newRightWidth > 10) {  // Minimum width constraint
        updateItemWidth(leftIndex, `${newLeftWidth}%`);
        updateItemWidth(rightIndex, `${newRightWidth}%`);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    separator.addEventListener('mousedown', onMouseDown);

    return () => {
      separator.removeEventListener('mousedown', onMouseDown);
    };
  }, [enabled, updateItemWidth, leftIndex, rightIndex]);

  if (!enabled) return null;

  return (
    <div
      ref={separatorRef}
      style={{
        width: '10px',
        cursor: 'col-resize',
        backgroundColor: '#ddd',
        zIndex: 1000
      }}
    />
  );
};

export const ResizableLayout: React.FC = () => {
  return (
    <ResizableContainer>
      <ResizableItem>
        <h2>Item 1</h2>
        <p>Content for item 1</p>
      </ResizableItem>
      <ResizableItem>
        <h2>Item 2</h2>
        <p>Content for item 2</p>
      </ResizableItem>
      <ResizableItem>
        <h2>Item 3</h2>
        <p>Content for item 3</p>
      </ResizableItem>
    </ResizableContainer>
  );
};

ResizableContainer.craft = {
  displayName: 'Resizable Container',
};

ResizableItem.craft = {
  displayName: 'Resizable Item',
  props: {
    width: '33.33%',
  },
  related: {
    toolbar: () => (
      <div>
        {/* Add any toolbar items specific to ResizableItem here */}
      </div>
    ),
  },
};