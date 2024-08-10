import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const ResizableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [childrenWithSeparators, setChildrenWithSeparators] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newChildrenWithSeparators = React.Children.toArray(children).reduce((acc: React.ReactNode[], child, index, array) => {
      if (index < array.length - 1) {
        return [...acc, child, <Separator key={`separator-${index}`} />];
      }
      return [...acc, child];
    }, []);
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
  const { connectors: { connect }, actions: { setProp }, id } = useNode();
  const [width, setWidth] = useState('33.33%');

  const updateWidth = useCallback((newWidth: string) => {
    setWidth(newWidth);
    setProp((props: any) => props.width = newWidth);
  }, [setProp]);

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

interface SeparatorProps {}

const Separator: React.FC<SeparatorProps> = () => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));
  const separatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const separator = separatorRef.current;
    if (!separator || !enabled) return;

    let startX: number;
    let leftElement: HTMLElement | null;
    let rightElement: HTMLElement | null;
    let leftStartWidth: number;
    let rightStartWidth: number;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startX = e.clientX;
      leftElement = separator.previousElementSibling as HTMLElement;
      rightElement = separator.nextElementSibling as HTMLElement;
      if (leftElement && rightElement) {
        leftStartWidth = leftElement.getBoundingClientRect().width;
        rightStartWidth = rightElement.getBoundingClientRect().width;
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!leftElement || !rightElement) return;
      const dx = e.clientX - startX;
      const containerWidth = separator.parentElement!.getBoundingClientRect().width;
      const leftNewWidth = ((leftStartWidth + dx) / containerWidth) * 100;
      const rightNewWidth = ((rightStartWidth - dx) / containerWidth) * 100;
      
      if (leftNewWidth > 10 && rightNewWidth > 10) {  // Minimum width constraint
        leftElement.style.flex = `0 0 ${leftNewWidth}%`;
        rightElement.style.flex = `0 0 ${rightNewWidth}%`;
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