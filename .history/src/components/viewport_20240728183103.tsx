import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useEditor, Node } from "@craftjs/core";
import { useState, useCallback, useEffect } from "react";

interface NodeData {
  displayName?: string;
  props?: Record<string, any>;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
  custom?: {
    componentName?: string;
  };
}

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

export const Viewport = ({ children }: { children: React.ReactNode }) => {
  const { selected, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [code, setCode] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // highlight-start
  const handleComponentClick = useCallback(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      
      // 检查选中的节点是否为 ROOT 节点
      if (selectedNodeId === 'ROOT' || selectedNode.data.name === 'Root') {
        setIsDrawerOpen(false);
        return;
      }

      const generatedCode = generateComponentCode(selectedNode, query);
      setCode(generatedCode);
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [selected, query]);
  // highlight-end

  useEffect(() => {
    const viewport = document.querySelector('.viewport');
    if (viewport) {
      viewport.addEventListener('click', handleComponentClick);
      return () => {
        viewport.removeEventListener('click', handleComponentClick);
      };
    }
  }, [handleComponentClick]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <div className="viewport w-full overflow-y-auto overflow-x-hidden" onClick={handleComponentClick}>
        <div className={"craftjs-renderer flex-1 h-full w-full"}>{children}</div>
      </div>
      <DrawerContent>
        <pre className="p-4 bg-gray-100 rounded overflow-auto">
          <code>{code}</code>
        </pre>
      </DrawerContent>
    </Drawer>
  );
};