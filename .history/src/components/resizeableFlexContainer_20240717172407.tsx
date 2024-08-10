import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const ResizableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
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
      {children}
    </div>
  );
};

export const ResizableItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectors: { connect }, actions: { setProp }, id } = useNode();
  const [width, setWidth] = useState('33.33%');
  const itemRef = useRef<HTMLDivElement>(null);

  const updateWidth = useCallback((newWidth: string) => {
    setWidth(newWidth);
    setProp((props: any) => props.width = newWidth);
  }, [setProp]);

  return (
    <div
      ref={(ref) => {
        itemRef.current = ref;
        connect(ref);
      }}
      style={{
        flex: `0 0 ${width}`,
        padding: '10px',
        backgroundColor: '#f0f0f0',
        position: 'relative'
      }}
    >
      {children}
      <Resizer onResize={updateWidth} itemId={id} itemRef={itemRef} />
    </div>
  );
};

interface ResizerProps {
  onResize: (newWidth: string) => void;
  itemId: string;
  itemRef: React.RefObject<HTMLDivElement>;
}

const Resizer: React.FC<ResizerProps> = ({ onResize, itemId, itemRef }) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  useEffect(() => {
    const resizer = resizerRef.current;
    const item = itemRef.current;
    if (!resizer || !item || !enabled) return;

    let startX: number, startWidth: number, nextElementStartWidth: number;
    let isResizing = false;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();  // Prevent CraftJS drag from starting
      isResizing = true;
      startX = e.clientX;
      const rect = item.getBoundingClientRect();
      startWidth = rect.width;
      const nextElement = item.nextElementSibling as HTMLElement;
      if (nextElement) {
        nextElementStartWidth = nextElement.getBoundingClientRect().width;
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const parentElement = item.parentElement;
      if (!parentElement) return;
      
      const dx = e.clientX - startX;
      const containerWidth = parentElement.getBoundingClientRect().width;
      const newWidth = ((startWidth + dx) / containerWidth) * 100;
      const nextElementNewWidth = ((nextElementStartWidth - dx) / containerWidth) * 100;
      
      if (newWidth > 10 && nextElementNewWidth > 10) {  // Minimum width constraint
        onResize(`${newWidth}%`);
        const nextElement = item.nextElementSibling as HTMLElement;
        if (nextElement) {
          nextElement.style.flex = `0 0 ${nextElementNewWidth}%`;
        }
      }
    };

    const onMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizer.addEventListener('mousedown', onMouseDown);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
    };
  }, [enabled, onResize, itemRef]);

  if (!enabled) return null;

  return (
    <div
      ref={resizerRef}
      style={{
        width: '10px',
        position: 'absolute',
        right: '-5px',
        top: 0,
        bottom: 0,
        cursor: 'col-resize',
        backgroundColor: '#ddd',
        zIndex: 1000  // Ensure the resizer is above other elements
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