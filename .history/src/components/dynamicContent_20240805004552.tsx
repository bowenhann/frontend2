import React, { useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { Element } from '@craftjs/core';
import { NodeButton } from '@/components/node/button';

export const DynamicContent = () => {
  const { connectors: { connect, drag }, id } = useNode();
  const { actions, query } = useEditor();
  const [content, setContent] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newContent = [
        {
          type: 'NodeButton',
          props: {
            className: "bg-blue-500 text-white px-4 py-2 rounded m-2",
            children: "Dynamically Added Button 1"
          }
        },
        {
          type: 'NodeButton',
          props: {
            className: "bg-green-500 text-white px-4 py-2 rounded m-2",
            children: "Dynamically Added Button 2"
          }
        }
      ];
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
      className="bg-yellow-100 p-2 m-2 rounded min-h-[100px] min-w-[200px]"
    >
      {content.map((item, index) => (
        <Element
          key={index}
          id={`${id}-child-${index}`}
          is={item.type}
          canvas
          {...item.props}
        />
      ))}
    </div>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  props: { content: [] },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};