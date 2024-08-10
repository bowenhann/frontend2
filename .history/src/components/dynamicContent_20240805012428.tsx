import React, { useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { NodeButton } from '@/components/node/button';

export const DynamicContent = () => {
  const { connectors: { connect, drag }, id } = useNode();
  const { actions, query, connectors: editorConnectors } = useEditor();
  const [content, setContent] = useState("Initial Content");

  useEffect(() => {
    const timer = setTimeout(() => {
      const newContent = (
        <div ref={connect}>
          <NodeButton className="bg-blue-500 text-white px-4 py-2 rounded">
            Dynamically Added Button
          </NodeButton>
        </div>
      );
      setContent(newContent);
      actions.setProp(id, (props) => {
        props.content = newContent;
      });
      console.log('Dynamic content updated');
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, actions, connect]);

  return (
    <div ref={connect}>
      {content}
      <div ref={editorConnectors.create}>
        <NodeButton className="bg-green-500 text-white px-4 py-2 rounded mt-2">
          New Content
        </NodeButton>
      </div>
    </div>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  props: { content: 'Initial Content' },
};