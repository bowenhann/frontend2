import { useEditor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { NodeButton } from '@/components/node/button';
import { NodeCard, NodeCardContent, NodeCardFooter, NodeCardHeader } from '@/components/node/card';
// Import other necessary components

const componentMap = {
  Button: NodeButton,
  Card: NodeCard,
  CardContent: NodeCardContent,
  CardFooter: NodeCardFooter,
  CardHeader: NodeCardHeader,
  // Add other components as needed
};

const renderVariant = (variantString) => {
  const componentRegex = /<(\w+)([^>]*)>(.*?)<\/\1>|<(\w+)([^>]*)\/>|([^<]+)/gs;
  const components = [];

  const parseProps = (propsString) => {
    const props = {};
    const propsRegex = /(\w+)=(?:{(.*?)}|"([^"]*)"|'([^']*)')/g;
    let match;
    while ((match = propsRegex.exec(propsString))) {
      const [, key, jsValue, doubleQuotedValue, singleQuotedValue] = match;
      props[key] = jsValue || doubleQuotedValue || singleQuotedValue;
    }
    return props;
  };

  const createComponent = (name, props, children) => {
    const Component = componentMap[name];
    if (Component) {
      return React.createElement(Component, props, children);
    }
    return null;
  };

  let match;
  while ((match = componentRegex.exec(variantString))) {
    const [, name, props, children, selfClosingName, selfClosingProps, text] = match;
    
    if (name || selfClosingName) {
      const componentName = name || selfClosingName;
      const componentProps = parseProps(props || selfClosingProps);
      const childComponents = children ? renderVariant(children) : null;
      components.push(createComponent(componentName, componentProps, childComponents));
    } else if (text) {
      components.push(text);
    }
  }

  return components;
};

const generateRandomTailwindClasses = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo'];
  const shades = ['300', '400', '500', '600', '700'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomShade = shades[Math.floor(Math.random() * shades.length)];
  return `bg-${randomColor}-${randomShade} text-white p-2 rounded`;
};

const VariantRenderer = ({ componentString }) => {
  const createComponent = (type, props, children) => {
    const Component = componentMap[type];
    if (!Component) return null;
    return React.createElement(Component, props, children);
  };

  const parseComponentString = (str) => {
    const componentRegex = /<(\w+)([^>]*)>(.*?)<\/\1>|<(\w+)([^>]*)\/>|([^<]+)/gs;
    const components = [];
    let match;

    while ((match = componentRegex.exec(str)) !== null) {
      const [, openTag, openProps, children, selfClosingTag, selfClosingProps, text] = match;
      
      if (openTag || selfClosingTag) {
        const type = openTag || selfClosingTag;
        const propsString = openProps || selfClosingProps;
        const props = {};
        const propsRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)")/g;
        let propMatch;
        while ((propMatch = propsRegex.exec(propsString)) !== null) {
          const [, key, jsValue, stringValue] = propMatch;
          props[key] = jsValue ? eval(jsValue) : stringValue;
        }
        
        if (children) {
          const childComponents = parseComponentString(children);
          components.push(createComponent(type, props, childComponents));
        } else {
          components.push(createComponent(type, props));
        }
      } else if (text) {
        components.push(text.trim());
      }
    }

    return components;
  };

  return <div className="variant-preview">{parseComponentString(componentString)}</div>;
};

export const ControlPanel = () => {
  const { active, related, actions } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related,
  }));

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      // 生成5个变体
      const newVariants = Array(5).fill(null).map(() => {
        const variantClasses = generateRandomTailwindClasses();
        return `<Button className="${variantClasses}">Variant Button</Button>`;
      });
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  }, [active]);

  const handleApplyStyle = (variantCode) => {
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
          {variants.map((variant, index) => (
            <div key={index} className="mb-4 border p-2 rounded">
              <div className="mb-2 p-2 bg-gray-100 rounded">
                <VariantRenderer componentString={variant} />
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mb-2">
                <code>{variant}</code>
              </pre>
              <button 
                className="w-full text-left p-2 bg-blue-100 rounded hover:bg-blue-200 text-xs"
                onClick={() => handleApplyStyle(variant)}
              >
                Apply This Style
              </button>
            </div>
          ))}
        </div>
      )}
      {active && related?.toolbar && React.createElement(related.toolbar)}
    </div>
  );
};