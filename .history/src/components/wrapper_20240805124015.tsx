import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { MonitorPlay, Smartphone, Code, Redo, Undo } from 'lucide-react';

type WrapperProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const Wrapper = ({ children, style = {} }: WrapperProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const [wrapperWidth, setWrapperWidth] = useState('w-[100%]');

  return (
    <div className="w-full h-full flex justify-center" style={style}>
      <div className={`${wrapperWidth} flex flex-col h-full border rounded-sm`}>
        <div className="flex justify-between items-center p-4 w-full bg-gray-200">
          <div className="flex gap-3">
            {/* Placeholder for control buttons */}
          </div>
          <div className="flex gap-2">
            {/* Placeholder for action buttons */}
          </div>
        </div>

        <div
          className="w-full flex-1 bg-white rounded-b-lg"
          ref={(ref) => {
            if (ref) {
              connect(drag(ref));
            }
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Wrapper.craft = {
  displayName: 'Wrapper',
  props: {
    className: 'w-full h-full',
  },
};