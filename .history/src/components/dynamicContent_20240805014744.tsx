import React, { useEffect, useState } from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';
import { NodeButton } from '@/components/node/button';

export const DynamicContent = () => {
  const { connectors: { connect, drag }, id } = useNode();
  const { actions, query } = useEditor();
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newButton = (
        <Element
          is={NodeButton}
          key={Date.now()}
          className="bg-blue-500 text-white px-4 py-2 rounded m-1"
        >
          Button {buttons.length + 1}
        </Element>
      );
      
      setButtons(prevButtons => [...prevButtons, newButton]);
      
      actions.setProp(id, (props) => {
        props.buttons = [...buttons, newButton];
      });
      
      console.log('New button added');
    }, 2000);

    return () => clearInterval(interval);
  }, [id, actions, buttons]);

  return (
    <div
      ref={ref => connect(drag(ref))}
      className="bg-yellow-100 p-2 m-2 rounded flex flex-wrap"
    >
      {buttons}
    </div>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  props: { buttons: [] },
};