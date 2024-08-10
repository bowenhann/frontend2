import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { VariantCanvas } from '@/components/variantCanvas';
import { NodeButton } from '@/components/node/button';

const componentMap = {
  Button: NodeButton,
  // Add other components here as needed
};

function renderComponents(componentString) {
  // ... (keep the existing renderComponents function)
}

// Function to generate random Tailwind classes
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

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const node = query.node(active).get();
      if (node) {
        const { type, props } = node.data;
        const componentName = type.resolvedName;
        
        // Generate 5 variants with different styles
        const newVariants = Array(5).fill(null).map(() => {
          const variantProps = { ...props, className: generateRandomTailwindClasses() };
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
                    const variantProps = VariantComponent().props;
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