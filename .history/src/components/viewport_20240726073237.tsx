import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useEditor } from "@craftjs/core";
import { useState, useCallback, useEffect } from "react";

interface NodeData {
  displayName?: string;
  props?: Record<string, any>;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
}

interface Node {
  data: NodeData;
}

const generateComponentCode = (node: Node): string => {
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

export const Viewport = ({ children }: { children: React.ReactNode }) => {
  const { selected, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [code, setCode] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleComponentClick = useCallback(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const generatedCode = generateComponentCode(selectedNode);
      setCode(generatedCode);
      setIsDrawerOpen(true);
    }
  }, [selected, query]);

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