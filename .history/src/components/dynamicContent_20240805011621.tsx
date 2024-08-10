import React, { useEffect, useState } from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';
import { NodeButton } from '@/components/node/button';

export const DynamicContent = ({ children }) => {
  const { connectors: { connect }, id } = useNode();
  const { actions, query } = useEditor();
  const [content, setContent] = useState(children || "Initial Content");

  useEffect(() => {
    const timer = setTimeout(() => {
      const newContent = (
        <Element
          id={`${id}-dynamic-button`}
          is={NodeButton}
          canvas
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Dynamically Added Button
        </Element>
      );
      setContent(newContent);
      actions.add(newContent, id);
      console.log('Dynamic content updated');
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, actions]);

  return (
    <div
      ref={connect}
      className="bg-yellow-100 p-2 m-2 rounded"
    >
      {content}
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
    canMoveOut: () => true,
  },
};