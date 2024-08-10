import React from 'react';
import { Element } from '@craftjs/core';
import type { Node, Nodes } from '@craftjs/core';

let imports: { displayName: string; importPath: string }[] = [];

const generateComponentCode = (
  nodesMap: Nodes,
  nodeId: string,
  level: number
): string => {
  const node = nodesMap[nodeId];
  
  if (!node || !node.data) {
    console.warn(`Node or node.data is undefined for nodeId: ${nodeId}`);
    return '';
  }

  const { displayName, props, nodes, linkedNodes, custom } = node.data;

  const componentName = displayName || 'UnknownComponent';

  const indentation = getIndentation(level);
  const openingTag = `<${componentName}${generatePropsString(props || {})}>`;
  const closingTag = `</${componentName}>`;

  if (custom && custom.importPath) {
    if (!imports.find((item) => item.displayName === componentName)) {
      imports.push({
        displayName: componentName,
        importPath: custom.importPath,
      });
    }
  }

  let content = '';
  if (props?.text) {
    // Handle text content from props.text
    content = props.text;
  } else if (props?.children) {
    // Handle children
    content = generateChildString(props.children, level + 1);
  }

  if (!nodes || nodes.length === 0 && (!linkedNodes || Object.keys(linkedNodes).length === 0)) {
    // No child nodes, return the tag with content
    return `${indentation}${openingTag}${content}${closingTag}`;
  } else {
    // Has child nodes, recursively generate code for children
    const childComponents = nodes ? nodes.map((childId) =>
      generateComponentCode(nodesMap, childId, level + 1)
    ) : [];

    const childComponentsString = childComponents.length
      ? `\n${childComponents.join(`\n`)}`
      : '';

    const linkedChildComponents = linkedNodes ? Object.entries(linkedNodes).map(
      ([key, value]) => generateComponentCode(nodesMap, value, level + 1)
    ) : [];

    const linkedChildComponentsString = linkedChildComponents.length
      ? `\n${linkedChildComponents.join(`\n`)}`
      : '';

    return `${indentation}${openingTag}${content}${childComponentsString}${linkedChildComponentsString}\n${indentation}${closingTag}`;
  }
};

const generatePropsString = (props: {
  [key: string]: any;
}): string => {
  const propsArray = Object.entries(props)
    .filter(([key]) => key !== 'children' && key !== 'text') // Exclude children and text from props
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`);
  return propsArray.length > 0 ? ` ${propsArray.join(' ')}` : '';
};

const getIndentation = (level: number): string => {
  return ' '.repeat(level * 2);
};

const generateChildString = (
  children: string | Node[] | undefined,
  level: number
): string => {
  if (typeof children === 'string') {
    // If children is a string, return it directly
    return children;
  } else if (Array.isArray(children) && children.length > 0) {
    return children
      .map((child) => {
        if (typeof child === 'string') {
          return child;
        } else if (child && typeof child === 'object') {
          return generateComponentCode({ TEMP: child } as Nodes, 'TEMP', level);
        }
        return '';
      })
      .join('');
  } else {
    return '';
  }
};

// ... rest of the code remains the same

export const getOutputCode = (nodes: Nodes) => {
  imports = [];

  console.log('nodes ', nodes);
  const componentString = generateComponentCode(nodes, 'ROOT', 2);
  const importString = generateImportStatements(imports);
  const output = wrapInsideComponent(componentString);
  console.log(generateImportStatements(imports));
  console.log('imports ', imports);

  return { importString, output };
};

// ... rest of the code remains the same