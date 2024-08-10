import React, { useEffect } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';

// Define a simple component
const Text = ({text}) => {
  return <p>{text}</p>;
};

Text.craft = {
  props: {
    text: 'Hello'
  },
};

// ContentUpdater component
const ContentUpdater = () => {
  const { actions } = useEditor();

  useEffect(() => {
    const timer = setTimeout(() => {
      const json = {
        ROOT: {
          type: { resolvedName: 'Frame' },
          isCanvas: true,
          props: {},
          displayName: 'Frame',
          custom: {},
          hidden: false,
          nodes: ['node1'],
          linkedNodes: {},
        },
        node1: {
          type: { resolvedName: 'Text' },
          isCanvas: false,
          props: { text: 'Hello from deserialized content!' },
          displayName: 'Text',
          custom: {},
          parent: 'ROOT',
          hidden: false,
          nodes: [],
          linkedNodes: {},
        },
      };

      actions.deserialize(json);
      console.log('Content deserialized');
    }, 2000);

    return () => clearTimeout(timer);
  }, [actions]);

  return null;
};

// Main App component
const App = () => {
  return (
    <div>
      <h1>Minimal Craft.js Demo</h1>
      <Editor resolver={{ Text }}>
        <Frame>
          <Element is={Text} text="Initial content" />
        </Frame>
        <ContentUpdater />
      </Editor>
    </div>
  );
};

export default App;