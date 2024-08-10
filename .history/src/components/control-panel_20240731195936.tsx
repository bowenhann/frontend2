import { useEditor, useNode } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { NodeButton } from '@/components/node/button';
import { Element, useNode } from '@craftjs/core';

const componentMap = {
  Button: NodeButton,
  // Add other components here as needed
};

const ComponentPreview = () => {
  const { id } = useNode();
  const { query } = useEditor();
  
  const node = query.node(id).get();
  const Component = componentMap[node.data.name] || (() => null);
  
  return (
    <Element id={id} canvas is={Component} {...node.data.props} />
  );
};

export const ControlPanel = () => {
  const { selected, actions, query } = useEditor((state, query) => ({
    selected: state.events.selected,
    nodeData: state.nodes[state.events.selected],
  }));

  const [activeProps, setActiveProps] = useState({});

  useEffect(() => {
    if (selected) {
      const node = query.node(selected).get();
      setActiveProps(node.data.props || {});
    } else {
      setActiveProps({});
    }
  }, [selected, query]);

  const handlePropChange = (key, value) => {
    if (selected) {
      actions.setProp(selected, (props) => {
        props[key] = value;
      });
      setActiveProps((prev) => ({ ...prev, [key]: value }));
    }
  };

  if (!selected || selected === 'ROOT') {
    return (
      <div className="w-80 border-l h-auto overflow-auto p-4">
        <h3 className="text-md font-semibold text-left mb-4">Control Panel</h3>
        <p>No component selected</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      <div className="p-4">
        <h4 className="text-sm font-semibold mb-4">Component Preview:</h4>
        <div className="mb-4 border p-2 rounded" style={{ height: '100px' }}>
          <ComponentPreview />
        </div>

        <h4 className="text-sm font-semibold mb-2">Properties:</h4>
        {Object.entries(activeProps).map(([key, value]) => (
          <div key={key} className="mb-2">
            <label className="block text-sm font-medium text-gray-700">{key}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handlePropChange(key, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        ))}
      </div>
    </div>
  );
};