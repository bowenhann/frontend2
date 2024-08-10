import React, { useEffect, useState } from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';
import { NodeButton } from '@/components/node/button';

export const DynamicContent = () => {
  const { connectors: { connect, drag }, id } = useNode();
  const { actions, query } = useEditor();
  const [content, setContent] = useState("Initial Content");

  useEffect(() => {
    const timer = setTimeout(() => {
      const newContent = (
        <Element canvas is={NodeButton} id={'dd'} className="bg-blue-500 text-white px-4 py-2 rounded">
          Dynamically Added Button
        </Element>
      );
      setContent(newContent);
      actions.setProp(id, (props) => {
        props.content = newContent;
      });
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
  props: { content: 'Initial Content' },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};