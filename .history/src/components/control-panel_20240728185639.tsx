import { useEditor, Node } from "@craftjs/core";
import React, { useEffect, useState } from "react";

const generateComponentCode = (node: Node, query: any, indent: string = ''): string => {
  if (!node || !node.data) {
    console.warn(`Node or node.data is undefined`);
    return '';
  }

  const { displayName, props, nodes, linkedNodes, custom } = node.data;
  const componentName = custom?.componentName || displayName || 'UnknownComponent';

  const openingTag = `<${componentName}${generatePropsString(props || {})}>`;
  const closingTag = `</${componentName}>`;

  let content = '';
  if (props?.text) {
    content = props.text;
  } else if (props?.children) {
    content = generateChildString(props.children);
  }

  let childContent = '';
  if (nodes && nodes.length > 0) {
    childContent = nodes.map(childId => {
      const childNode = query.node(childId).get();
      return generateComponentCode(childNode, query, indent + '  ');
    }).join('\n');
  }

  if (linkedNodes) {
    childContent += Object.entries(linkedNodes).map(([, childId]) => {
      const childNode = query.node(childId).get();
      return generateComponentCode(childNode, query, indent + '  ');
    }).join('\n');
  }

  if (childContent) {
    return `${indent}${openingTag}\n${childContent}\n${indent}${closingTag}`;
  } else {
    return `${indent}${openingTag}${content}${closingTag}`;
  }
};

const generatePropsString = (props: Record<string, any>): string => {
  const propsArray = Object.entries(props)
    .filter(([key]) => key !== 'children' && key !== 'text')
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`);
  return propsArray.length > 0 ? ` ${propsArray.join(' ')}` : '';
};

const generateChildString = (children: any): string => {
  if (typeof children === 'string') {
    return children;
  } else if (Array.isArray(children)) {
    return children.map(child => {
      if (typeof child === 'string') {
        return child;
      }
      return '';
    }).join('');
  }
  return '';
};

const generateTailwindVariations = (baseClasses: string) => {
  const variations = [
    baseClasses + ' bg-blue-500 text-white',
    baseClasses + ' bg-red-500 text-white',
    baseClasses + ' border-2 border-green-500 text-green-500',
    baseClasses + ' shadow-lg rounded-full',
    baseClasses + ' bg-gradient-to-r from-purple-500 to-pink-500 text-white'
  ];
  return variations;
};

const renderComponent = (componentString: string) => {
  // 注意：这种方法可能有安全隐患，仅用于演示
  const Component = new Function('React', `return ${componentString}`)
  return <Component />;
};

export const ControlPanel = () => {
  const { active, related, query, actions } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();
    return {
      active: currentlySelectedNodeId,
      related:
        currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related,
    };
  });

  const [code, setCode] = useState('');
  const [variations, setVariations] = useState<string[]>([]);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const selectedNode = query.node(active).get();
      const generatedCode = generateComponentCode(selectedNode, query);
      setCode(generatedCode);

      // Generate variations
      const baseClasses = selectedNode.data.props.className || '';
      const newVariations = generateTailwindVariations(baseClasses);
      setVariations(newVariations);
    } else {
      setCode('');
      setVariations([]);
    }
  }, [active, query]);

  const handleVariationClick = (newClassName: string) => {
    if (active && active !== 'ROOT') {
      actions.setProp(active, (props: any) => {
        props.className = newClassName;
      });
    }
  };

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {active && active !== 'ROOT' && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-2">Component Code:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-60">
            <code>{code}</code>
          </pre>
          <h4 className="text-sm font-semibold mt-4 mb-2">Variations:</h4>
          <div className="space-y-2">
            {variations.map((variation, index) => (
              <div 
                key={index} 
                onClick={() => handleVariationClick(variation)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                {renderComponent(code.replace(/className="[^"]*"/, `className="${variation}"`))}
              </div>
            ))}
          </div>
        </div>
      )}
      {active && related.toolbar && React.createElement(related.toolbar)}
    </div>
  );
};