import { useEditor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { NodeButton } from '@/components/node/button';
// Import other components as needed

const componentMap = {
  Button: NodeButton,
  // Add other components here
};

export const ControlPanel = () => {
  const { active, related, actions, query } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [activeProps, setActiveProps] = useState({});
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const node = query.node(active).get();
      setActiveProps(node.data.props);
      setActiveComponent(node.data.displayName);
    } else {
      setActiveProps({});
      setActiveComponent(null);
    }
  }, [active, query]);

  const handlePropChange = (key, value) => {
    if (active) {
      actions.setProp(active, (props) => {
        props[key] = value;
      });
      setActiveProps((prev) => ({ ...prev, [key]: value }));
    }
  };

  const renderActiveComponent = () => {
    if (!activeComponent) return null;
    const Component = componentMap[activeComponent];
    if (!Component) return null;

    return (
      <div className="border p-4 mb-4 rounded">
        <Component {...activeProps} />
      </div>
    );
  };

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {active && active !== 'ROOT' && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-2">Current Component:</h4>
          {renderActiveComponent()}

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
      )}
      {active && related?.toolbar && React.createElement(related.toolbar)}
    </div>
  );
};