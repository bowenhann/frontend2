import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const ResizableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  const [childWidths, setChildWidths] = useState<string[]>([]);

  useEffect(() => {
    const childCount = React.Children.count(children);
    setChildWidths(new Array(childCount).fill(`${100 / childCount}%`));
  }, [children]);

  const updateChildWidth = useCallback((index: number, newWidth: string) => {
    setChildWidths(prev => {
      const newWidths = [...prev];
      newWidths[index] = newWidth;
      return newWidths;
    });
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
      {React.Children.map(children, (child, index) => (
        <>
          <ResizableItem 
            key={`item-${index}`} 
            width={childWidths[index]} 
            onResize={(newWidth) => updateChildWidth(index, newWidth)}
          >
            {child}
          </ResizableItem>
          {index < React.Children.count(children) - 1 && (
            <Separator 
              key={`separator-${index}`}
              onResize={(delta) => {
                const newLeftWidth = `${parseFloat(childWidths[index]) + delta}%`;
                const newRightWidth = `${parseFloat(childWidths[index + 1]) - delta}%`;
                updateChildWidth(index, newLeftWidth);
                updateChildWidth(index + 1, newRightWidth);
              }}
            />
          )}
        </>
      ))}
    </div>
  );
};

interface ResizableItemProps {
  children: React.ReactNode;
  width: string;
  onResize: (newWidth: string) => void;
}

const ResizableItem: React.FC<ResizableItemProps> = ({ children, width, onResize }) => {
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
  onResize: (widthDelta: number) => void;
}

const Separator: React.FC<SeparatorProps> = ({ onResize }) => {
  const separatorRef = useRef<HTMLDivElement>(null);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  useEffect(() => {
    const separator = separatorRef.current;
    if (!separator || !enabled) return;

    let startX: number;
    let isResizing = false;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const dx = e.clientX - startX;
      const containerWidth = separator.parentElement?.getBoundingClientRect().width || 0;
      const widthDelta = (dx / containerWidth) * 100;
      onResize(widthDelta);
      startX = e.clientX;
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
  }, [enabled, onResize]);

  if (!enabled) return null;

  return (
    <div
      ref={separatorRef}
      style={{
        width: '10px',
        backgroundColor: '#ddd',
        cursor: 'col-resize',
        zIndex: 1000
      }}
    />
  );
};

export const ResizableLayout: React.FC = () => {
  return (
    <ResizableContainer>
      <div>
        <h2>Item 1</h2>
        <p>Content for item 1</p>
      </div>
      <div>
        <h2>Item 2</h2>
        <p>Content for item 2</p>
      </div>
      <div>
        <h2>Item 3</h2>
        <p>Content for item 3</p>
      </div>
    </ResizableContainer>
  );
};

ResizableContainer.craft = {
  displayName: 'Resizable Container',
};

ResizableItem.craft = {
  displayName: 'Resizable Item',
  props: {},
  related: {
    toolbar: () => (
      <div>
        {/* Add any toolbar items specific to ResizableItem here */}
      </div>
    ),
  },
};