import React, { useEffect, useState } from "react";
import { useEditor, Element } from "@craftjs/core";

// Import your component map here
import { componentMap } from './componentMap';

const generateRandomTailwindClasses = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const roundedness = ['rounded', 'rounded-md', 'rounded-lg', 'rounded-full'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomRoundedness = roundedness[Math.floor(Math.random() * roundedness.length)];

  return `bg-${randomColor}-500 text-white p-${randomSize} ${randomRoundedness}`;
};

const renderComponents = (componentsString) => {
  const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|<(\w+)(\s[^>]*)?\/>|([^<]+)/gs;
  const components = [];

  function parseProps(attributesString) {
    const props = {};
    if (attributesString) {
      const attributeRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)"|'([^']*)')/g;
      let attributeMatch;
      while ((attributeMatch = attributeRegex.exec(attributesString))) {
        const [, name, jsValue, doubleQuotedValue, singleQuotedValue] = attributeMatch;
        if (name === 'className') {
          props[name] = `${props[name] || ''} ${jsValue || doubleQuotedValue || singleQuotedValue}`.trim();
        } else {
          props[name] = jsValue || doubleQuotedValue || singleQuotedValue;
        }
      }
    }
    return props;
  }

  function createComponent(name, props, children) {
    let Component = componentMap[name];
    if (Component) {
      if (Component === ResizableComponent) {
        return (
          <Element
            key={components.length}
            is={ResizableComponent}
            canvas
            {...props}
          >
            {children}
          </Element>
        );
      } else {
        return <Element key={components.length} is={Component} {...props}>{children}</Element>;
      }
    } else {
      // Handle native HTML elements
      return React.createElement(name, { key: components.length, ...props }, children);
    }
  }

  let match;
  while ((match = regex.exec(componentsString))) {
    const [, componentName, attributes, children, selfClosingName, selfClosingAttributes, textContent] = match;

    if (componentName || selfClosingName) {
      const name = componentName || selfClosingName;
      const props = parseProps(attributes || selfClosingAttributes);

      let childComponents = [];
      if (children) {
        childComponents = renderComponents(children);
      }

      components.push(createComponent(name, props, childComponents));
    } else if (textContent) {
      components.push(textContent.trim());
    }
  }

  return components;
};

export const ControlPanel = () => {
  const { selected, actions, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [code, setCode] = useState('');
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const { type, props } = selectedNode.data;
      const generatedCode = `<${type} ${Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ')}>${props.children || ''}</${type}>`;
      setCode(generatedCode);

      // Generate 5 variants
      const newVariants = Array(5).fill(null).map(() => {
        const variantClasses = generateRandomTailwindClasses();
        return generatedCode.replace(/className="[^"]*"/, `className="${variantClasses}"`);
      });
      setVariants(newVariants);
    } else {
      setCode('');
      setVariants([]);
    }
  }, [selected, query]);

  const handleVariantClick = (variantCode) => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const classMatch = variantCode.match(/className="([^"]*)"/);
      if (classMatch) {
        actions.setProp(selectedNodeId, (props) => {
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
      {selected.size > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-2">Component Code:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-60">
            <code>{code}</code>
          </pre>
          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
          {variants.map((variant, index) => (
            <div key={index} className="mb-4 border p-2 rounded">
              <div className="mb-2">
                {renderComponents(variant)}
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mb-2">
                <code>{variant}</code>
              </pre>
              <button 
                className="w-full text-left p-2 bg-blue-100 rounded hover:bg-blue-200 text-xs"
                onClick={() => handleVariantClick(variant)}
              >
                Apply This Style
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};