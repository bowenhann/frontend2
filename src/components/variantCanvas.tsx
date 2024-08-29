import React from 'react';
import { Frame, Element } from '@craftjs/core';

type VariantCanvasProps = {
  children: React.ReactNode;
};

export const VariantCanvas: React.FC<VariantCanvasProps> = ({ children }) => {
  return (
    <div className="w-full h-full bg-white rounded">
      <Frame>
        <Element
          canvas
          is="div"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </Element>
      </Frame>
    </div>
  );
};