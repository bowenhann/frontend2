import { useEditor, Editor, ge } from "@craftjs/core";
import React, { useEffect, useState, useCallback } from "react";
import { VariantCanvas } from '@/components/variantCanvas';
import { NodeButton } from '@/components/node/button';

const componentMap = {
  Button: NodeButton,
  // Add other components here as needed
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

const generateRandomTailwindClasses = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo'];
  const shades = ['300', '400', '500', '600', '700'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const roundedness = ['rounded', 'rounded-md', 'rounded-lg', 'rounded-full'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomShade = shades[Math.floor(Math.random() * shades.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomRoundedness = roundedness[Math.floor(Math.random() * roundedness.length)];

  return `bg-${randomColor}-${randomShade} text-white p-${randomSize} ${randomRoundedness}`;
};

export const ControlPanel = () => {
  const { active, related, actions } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [variants, setVariants] = useState([]);

  const generateVariants = useCallback(() => {
    if (active && active !== 'ROOT') {
      const baseComponent = actions.query.getNode(active).data;
      const newVariants = Array(5).fill(null).map(() => {
        const variantClasses = generateRandomTailwindClasses();
        return `<${baseComponent.type} className="${variantClasses}">${baseComponent.props.children || 'Button'}</${baseComponent.type}>`;
      });
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  }, [active, actions.query]);

  useEffect(() => {
    generateVariants();
  }, [active, generateVariants]);

  const applyVariant = (variantCode) => {
    if (active && active !== 'ROOT') {
      const classMatch = variantCode.match(/className="([^"]*)"/);
      if (classMatch) {
        actions.setProp(active, (props) => {
          props.className = classMatch[1];
        });
      }
    }
  };

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {active && active !== 'ROOT' && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
          <button 
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={generateVariants}
          >
            Generate New Variants
          </button>
          {variants.map((variant, index) => {
            const VariantComponent = renderComponents(variant);
            return (
              <div key={index} className="mb-4 border p-2 rounded">
                <div className="mb-2" style={{ height: '100px' }}>
                  <Editor
                    resolver={{
                      ...componentMap,
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
                  className="w-full px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  onClick={() => applyVariant(variant)}
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