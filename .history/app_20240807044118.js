import React from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';

// Basic components
const Text = ({ text }) => <p>{text}</p>;
const Container = ({ children }) => <div>{children}</div>;

Text.craft = { 
  props: { text: 'Text' },
  displayName: 'Text'
};

Container.craft = { 
  props: { children: [] },
  displayName: 'Container',
  isCanvas: true
};

// Button to add new node
const AddNodeButton = () => {
  const { actions, query } = useEditor();

  const addNewNode = () => {
    const newNode = {
      type: { resolvedName: 'Text' },
      isCanvas: false,
      props: { text: 'New Text' },
      displayName: 'Text',
    };

    actions.addNodeTree(newNode, 'ROOT');
    
    console.log('Nodes after adding:', JSON.stringify(query.getNodes(), null, 2));
  };

  return <button onClick={addNewNode}>Add New Text</button>;
};

// Main App component
const App = () => {
  return (
    <Editor resolver={{ Text, Container }}>
      <Frame>
        <Element is={Container} canvas>
          <Text text="Initial text" />
        </Element>
      </Frame>
      <AddNodeButton />
    </Editor>
  );
};

export default App;
