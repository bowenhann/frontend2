import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState, useRef } from "react";
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

function generateComponentString(type, props, children) {
  const componentName = getComponentName(type);
  const propsString = Object.entries(props)
    .filter(([key, value]) => key !== 'children' && value !== undefined)
    .map(([key, value]) => {
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


function generateRandomBgColor() {
  const colors = [
    'red', 'blue', 'green', 'yellow', 'indigo', 'purple', 'pink', 
    'gray', 'orange', 'teal', 'cyan', 'lime', 'emerald', 'fuchsia'
  ];
  const shades = ['100', '200', '300', '400', '500', '600', '700'];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomShade = shades[Math.floor(Math.random() * shades.length)];
  
  return `bg-${randomColor}-${randomShade}`;
}

function generateRandomText(componentType) {
  const texts = {
    Button: ['Click me', 'Submit', 'OK', 'Cancel', 'Next', 'Previous', 'Save'],
    Card: ['Card Title', 'Important Info', 'News Item', 'Product Details'],
    CardHeader: ['Header', 'Title', 'Section'],
    CardContent: ['This is some sample content.', 'Here\'s some information.', 'Product description goes here.'],
    CardFooter: ['Footer', 'Additional Info', 'Copyright 2023'],
    default: ['Sample Text', 'Example Content', 'Lorem Ipsum']
  };

  const options = texts[componentType] || texts.default;
  return options[Math.floor(Math.random() * options.length)];
}

export const ControlPanel = () => {
  const { active, related, query } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [variants, setVariants] = useState([]);
  const [editorKey, setEditorKey] = useState(0);
  const prevActiveRef = useRef(null);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const node = query.node(active).get();
      if (node) {
        const { type, props } = node.data;
        const componentType = getComponentName(type);
        const baseString = generateComponentString(type, props, props.children || '');
        
        // Generate 5 variants with different background colors and text
        const newVariants = Array(5).fill(null).map(() => {
          const bgColorClass = generateRandomBgColor();
          const randomText = generateRandomText(componentType);
          const variantProps = { ...props, className: `${props.className || ''} ${bgColorClass}`.trim() };
          return generateComponentString(type, variantProps, randomText);
        });

        setVariants([baseString, ...newVariants]);

        // If the active component has changed, increment the editorKey
        if (active !== prevActiveRef.current) {
          setEditorKey(prev => prev + 1);
          prevActiveRef.current = active;
        }
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
              <div key={`${editorKey}-${index}`} className="mb-4 border p-2 rounded">
                <div className="mb-2" style={{ height: '100px' }}>
                  <Editor
                    key={`${editorKey}-${index}`}
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