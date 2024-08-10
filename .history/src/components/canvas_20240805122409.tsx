import React from 'react';
import { useNode } from '@craftjs/core';

type CanvasProps = {
  children: React.ReactNode;
  className?: string;
};

export const Canvas = ({ children, className = '' }: CanvasProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`w-full h-full flex justify-center ${className}`}
    >
      <div className="w-full flex flex-col h-full border rounded-sm">
        <div className="w-full flex-1 bg-white rounded-b-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

Canvas.craft = {
  displayName: 'Canvas',
  props: {
    className: '',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};