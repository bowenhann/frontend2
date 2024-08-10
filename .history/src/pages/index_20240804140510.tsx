import React from 'react';
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core';

const Container = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(dom) => connect(drag(dom))} 
      className="border border-gray-300 p-4 m-2"
    >
      <h2 className="text-lg font-bold mb-2">Container</h2>
      <p className="mb-2">This is a container component</p>
      {children}
      <CopyButton />
    </div>
  );
};

let id = 0;

const CopyButton = () => {
  const { id } = useNode();
  const { actions: { add }, query: { createNode, node } } = useEditor();

  const copyContainer = React.useCallback(() => {
    const { data: { type, props } } = node(id).get();
    const newNode = createNode(React.createElement(type, props));
    add(newNode, node(id).get().data.parent);
  }, [id, add, createNode, node]);

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={copyContainer}
    >
      Make a copy of me
    </button>
  );
};

const ContainerSettings = () => {
  const { actions: { setProp } } = useNode();
  return (
    <div className="p-2">
      <h3 className="font-bold mb-2">Container Settings</h3>
      {/* Add settings controls here if needed */}
    </div>
  );
};

Container.craft = {
  related: {
    settings: ContainerSettings,
  },
};

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CraftJS Container Demo</h1>
      <Editor resolver={{ Container }}>
        <Frame>
          <Element is={Container} canvas>
            <Container />
          </Element>
        </Frame>
      </Editor>
    </div>
  );
};

export default App;