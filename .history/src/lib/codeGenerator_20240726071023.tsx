interface NodeData {
  displayName?: string;
  props?: Record<string, any>;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
}

interface Node {
  data: NodeData;
}

export const generateComponentCode = (node: Node): string => {
  if (!node || !node.data) {
    console.warn(`Node or node.data is undefined`);
    return '';
  }

  const { displayName, props, nodes, linkedNodes } = node.data;
  const componentName = displayName || 'UnknownComponent';

  const openingTag = `<${componentName}${generatePropsString(props || {})}>`;
  const closingTag = `</${componentName}>`;

  if (!nodes || nodes.length === 0 && (!linkedNodes || Object.keys(linkedNodes).length === 0)) {
    return `${openingTag}${generateChildString(props?.children)}${closingTag}`;
  } else {
    return `${openingTag}\n  {/* Child components */}\n${closingTag}`;
  }
};

const generatePropsString = (props: Record<string, any>): string => {
  const propsArray = Object.entries(props)
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`);
  return propsArray.length > 0 ? ` ${propsArray.join(' ')}` : '';
};

const generateChildString = (children: any): string => {
  if (typeof children === 'string') {
    return children;
  } else {
    return '';
  }
};