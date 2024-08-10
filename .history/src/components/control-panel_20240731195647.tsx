import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { VariantCanvas } from '@/components/variantCanvas';
import { NodeButton } from '@/components/node/button';

const componentMap = {
  Button: NodeButton,
};

function renderComponents(componentString) {
  const regex = /<(\w+)([^>]*)>(.*?)<\/\1>/;
  const match = regex.exec(componentString);

  if (match) {
    const [, componentName, propsString, children] = match;
    const Component = componentMap[componentName];

    if (Component) {
      const props = {};
      const propsRegex = /(\w+)="([^"]*)"/g;
      let propMatch;
      while ((propMatch = propsRegex.exec(propsString))) {
        const [, key, value] = propMatch;
        props[key] = value;
      }

      return (nodeProps) => (
        <Component {...props} {...nodeProps}>
          {children}
        </Component>
      );
    }
  }

  return () => null;
}

function generateRandomTailwindClasses() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  return `bg-${randomColor}-500 text-white p-${randomSize} rounded`;
}

export const ControlPanel = () => {
  const { active, related, actions, query } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [variants, setVariants] = useState([]);
  const [activeProps, setActiveProps] = useState({});

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const node = query.node(active).get();
      setActiveProps(node.data.props);

      // Generate 5 random variants
      const newVariants = Array(5).fill(null).map(() => {
        const randomClasses = generateRandomTailwindClasses();
        return `<Button className="${randomClasses}">${node.data.props.children || 'Button'}</Button>`;
      });
      setVariants(newVariants);
    } else {
      setVariants([]);
      setActiveProps({});
    }
  }, [active, query]);

  const handleApplyStyle = (variantCode) => {
    const classMatch = variantCode.match(/className="([^"]*)"/);
    if (classMatch && active) {
      actions.setProp(active, (props) => {
        props.className = classMatch[1];
      });
    }
  };

  const handlePropChange = (key, value) => {
    if (active) {
      actions.setProp(active, (props) => {
        props[key] = value;
      });
      setActiveProps((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {active && active !== 'ROOT' && (
        <div className="p-4">
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

          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
          {variants.map((variant, index) => {
            const VariantComponent = renderComponents(variant);
            return (
              <div key={index} className="mb-4 border p-2 rounded">
                <div className="mb-2" style={{ height: '100px' }}>
                  <Editor
                    resolver={{
                      Button: NodeButton,
                      VariantComponent
                    }}
                  >
                    <VariantCanvas>
                      <VariantComponent />
                    </VariantCanvas>
                  </Editor>
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mb-2">
                  <code>{variant}</code>
                </pre>
                <button 
                  onClick={() => handleApplyStyle(variant)}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Apply This Style
                </button>
              </div>
            );
          })}
        </div>
      )}
      {active && related?.toolbar && React.createElement(related.toolbar)}
    </div>
  );
};