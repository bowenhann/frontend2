import React, { useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { NodeButton } from '@/components/node/button';
import { Element, Canvas } from '@craftjs/core';

export const DynamicContent = () => {
  const { connectors: { connect, drag }, id } = useNode();
  const { actions, query } = useEditor();
  const [content, setContent] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newContent = (
        <NodeButton
          canvas
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Dynamically Added Button
        </NodeButton>
      );
      setContent(newContent);
      actions.add(newContent, id);
      console.log('Dynamic content updated');
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, actions]);

  return (
    <div
      ref={ref => connect(drag(ref))}
      className="bg-yellow-100 p-2 m-2 rounded"
    >
      <Canvas id={`dynamic-canvas-${id}`}>
        {content}
      </Canvas>
    </div>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  props: {},
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};