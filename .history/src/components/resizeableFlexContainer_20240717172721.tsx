import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const ResizableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [childrenWithSeparators, setChildrenWithSeparators] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newChildrenWithSeparators: React.ReactNode[] = [];
    React.Children.forEach(children, (child, index) => {
      if (index > 0) {
        newChildrenWithSeparators.push(
          <Separator key={`separator-${index}`} index={index} />
        );
      }
      newChildrenWithSeparators.push(child);
    });
    setChildrenWithSeparators(newChildrenWithSeparators);
  }, [children]);

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

export const ResizableItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectors: { connect }, id } = useNode();
  const [width, setWidth] = useState('33.33%');

  const updateWidth = useCallback((newWidth: string) => {
    setWidth(newWidth);
  }, []);

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
  index: number;
}

const Separator: React.FC<SeparatorProps> = ({ index }) => {
  const separatorRef = useRef<HTMLDivElement>(null);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  useEffect(() => {
    const separator = separatorRef.current;
    if (!separator || !enabled) return;

    let startX: number;
    let leftItemStartWidth: number;
    let rightItemStartWidth: number;
    let isResizing = false;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      const leftItem = separator.previousElementSibling as HTMLElement;
      const rightItem = separator.nextElementSibling as HTMLElement;
      if (leftItem && rightItem) {
        leftItemStartWidth = leftItem.getBoundingClientRect().width;
        rightItemStartWidth = rightItem.getBoundingClientRect().width;
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const dx = e.clientX - startX;
      const leftItem = separator.previousElementSibling as HTMLElement;
      const rightItem = separator.nextElementSibling as HTMLElement;
      if (leftItem && rightItem) {
        const containerWidth = separator.parentElement!.getBoundingClientRect().width;
        const newLeftWidth = ((leftItemStartWidth + dx) / containerWidth) * 100;
        const newRightWidth = ((rightItemStartWidth - dx) / containerWidth) * 100;
        if (newLeftWidth > 10 && newRightWidth > 10) {
          leftItem.style.flex = `0 0 ${newLeftWidth}%`;
          rightItem.style.flex = `0 0 ${newRightWidth}%`;
        }
      }
    };

    const onMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    separator.addEventListener('mousedown', onMouseDown);

    return () => {
      separator.removeEventListener('mousedown', onMouseDown);
    };
  }, [enabled]);

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