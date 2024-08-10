import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { VariantCanvas } from '@/components/variantCanvas';
import { NodeButton } from '@/components/node/button';
// Import other components as needed
import { generateRandomTailwindClasses } from '@/lib/tailwindUtils'; // Assume this function exists

const componentMap = {
  Button: NodeButton,
  // Add other components here
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

export const ControlPanel = () => {
  const { active, related, actions, query } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const node = query.node(active).get();
      if (node) {
        const { type, props } = node.data;
        const componentName = type.resolvedName;
        
        // Generate 5 variants with random Tailwind classes
        const newVariants = Array(5).fill(null).map(() => {
          const randomClasses = generateRandomTailwindClasses();
          const variantProps = { ...props, className: randomClasses };
          const propsString = Object.entries(variantProps)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
          return `<${componentName} ${propsString}>${props.children || ''}</${componentName}>`;
        });

        setVariants(newVariants);
      }
    } else {
      setVariants([]);
    }
  }, [active, query]);

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {active && active !== 'ROOT' && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
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
                  className="w-full text-left p-2 bg-blue-100 rounded hover:bg-blue-200 text-xs"
                  onClick={() => {
                    const variantProps = renderComponents(variant)().props;
                    actions.setProp(active, (props) => {
                      Object.assign(props, variantProps);
                    });
                  }}
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