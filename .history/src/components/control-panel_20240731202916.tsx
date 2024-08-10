import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { VariantCanvas } from '@/components/variantCanvas';
import { NodeButton } from '@/components/node/button';
import { NodeCard, NodeCardHeader, NodeCardContent, NodeCardFooter } from '@/components/node/card';
// Import other components as needed

const componentMap = {
  NodeButton,
  NodeCard,
  NodeCardHeader,
  NodeCardContent,
  NodeCardFooter,
  // Add other components to the map as needed
};

const componentNameMap = {
  NodeButton: 'Button',
  NodeCard: 'Card',
  NodeCardHeader: 'CardHeader',
  NodeCardContent: 'CardContent',
  NodeCardFooter: 'CardFooter',
  // Add mappings for other components as needed
};

function getComponentName(type) {
  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    return componentNameMap[type.name] || type.name;
  }
  if (type && type.craft) {
    const craftName = type.craft.name || type.craft.displayName;
    return componentNameMap[craftName] || craftName || 'UnknownComponent';
  }
  return 'UnknownComponent';
}

function generateRandomTailwindClasses() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'];
  const shades = ['100', '200', '300', '400', '500', '600', '700', '800'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const roundedness = ['rounded', 'rounded-md', 'rounded-lg', 'rounded-full'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomShade = shades[Math.floor(Math.random() * shades.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomRoundedness = roundedness[Math.floor(Math.random() * roundedness.length)];

  return `bg-${randomColor}-${randomShade} text-white p-${randomSize} ${randomRoundedness}`;
}

function generateComponentString(type, props, children) {
  const componentName = getComponentName(type);
  const propsString = Object.entries(props)
    .filter(([key, value]) => key !== 'children' && value !== undefined)
    .map(([key, value]) => {
      if (key === 'className') {
        // Use the function to generate className
        return `className="${generateRandomTailwindClasses()}"`;
      }
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(' ');

  return `<${componentName}${propsString ? ' ' + propsString : ''}>${children || ''}</${componentName}>`;
}

function renderComponents(componentString) {
  const regex = /<(\w+)([^>]*)>(.*?)<\/\1>/;
  const match = regex.exec(componentString);

  if (match) {
    const [, componentName, propsString, children] = match;
    const fullComponentName = Object.keys(componentNameMap).find(key => componentNameMap[key] === componentName);
    const Component = componentMap[fullComponentName];

    if (Component) {
      const props = {};
      const propsRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)")/g;
      let propMatch;
      while ((propMatch = propsRegex.exec(propsString))) {
        const [, key, objectValue, stringValue] = propMatch;
        props[key] = objectValue ? JSON.parse(objectValue) : stringValue;
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
        const { type, props, nodes } = node.data;
        const baseString = generateComponentString(type, props, props.children || '');
        
        // Generate 5 variants with different styles
        const newVariants = Array(5).fill(null).map(() => {
          return generateComponentString(type, props, props.children || '');
        });

        setVariants([baseString, ...newVariants]);
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
              </div>
            );
          })}
        </div>
      )}
      {active && related?.toolbar && React.createElement(related.toolbar)}
    </div>
  );
};