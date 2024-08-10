import React, { useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { NodeButton } from '@/components/node/button';
import { ResizableComponent } from '@/components/resizableComponent';

export const DynamicContent = () => {
  const { connectors: { connect, drag }, id } = useNode();
  const { actions, query } = useEditor();
  const [content, setContent] = useState("Initial Content");

  useEffect(() => {
    const timer = setTimeout(() => {
      const newContent = (
        <ResizableComponent width='20%' height='20%'>
              <NodeButton className="bg-blue-500 text-white px-4 py-2 rounded">
                Button
              </NodeButton>
						</ResizableComponent>
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
       ref={ref => connect(drag(ref))}
       className="bg-yellow-100 p-2 m-2 rounded"
     >
      {content}
    </div>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  props: { content: 'Initial Content' },
};