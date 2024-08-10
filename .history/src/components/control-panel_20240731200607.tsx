import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { VariantCanvas } from '@/components/variantCanvas';
import { NodeButton } from '@/components/node/button';
import { NodeCard, NodeCardContent, NodeCardFooter, NodeCardHeader } from '@/components/node/card';
// Import other components as needed

const componentMap = {
  Button: NodeButton,
  Card: NodeCard,
  CardContent: NodeCardContent,
  CardFooter: NodeCardFooter,
  CardHeader: NodeCardHeader,
  // Add other components to the map as needed
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

function generateComponentString(component, props) {
  const propsString = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<${component} ${propsString}>${props.text || ''}</${component}>`;
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
        
        // Generate base variant
        const baseVariant = generateComponentString(componentName, props);
        
        // Generate additional variants (you can customize this part)
        const additionalVariants = [
          generateComponentString(componentName, { ...props, className: 'bg-blue-500 text-white p-2' }),
          generateComponentString(componentName, { ...props, className: 'border-2 border-red-500 p-2' }),
          generateComponentString(componentName, { ...props, className: 'shadow-lg rounded-full p-2' }),
        ];
        
        setVariants([baseVariant, ...additionalVariants]);
      } else {
        setVariants([]);
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
                    resolver={componentMap}
                  >
                    <VariantCanvas>
                      <VariantComponent />
                    </VariantCanvas>
                  </Editor>
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mb-2">
                  <code>{variant}</code>
                </pre>
              </div>
            );
          })}
        </div>
      )}
      {active && related?.toolbar && React.createElement(related.toolbar)}
    </div>
  );
};