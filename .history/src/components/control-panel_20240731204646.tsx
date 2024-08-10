import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState， } from "react";
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



const renderComponents = useCallback((componentString) => {
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
}, []);

export const ControlPanel = () => {
  const { active, related, actions, query } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [variants, setVariants] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const node = query.node(active).get();
      if (node) {
        const { type, props, nodes } = node.data;
        console.log('Selected component:', type.name || type);
        setSelectedComponent(type);
        const baseString = generateComponentString(type, props, props.children || '');
        
        // Generate 5 variants with different styles
        const newVariants = Array(5).fill(null).map((_, index) => {
          const variantProps = { ...props, className: `variant-${index + 1}` };
          return generateComponentString(type, variantProps, props.children || '');
        });

        console.log('New variants:', [baseString, ...newVariants]);
        setVariants([baseString, ...newVariants]);
      }
    } else {
      setVariants([]);
      setSelectedComponent(null);
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
            // Re-create VariantComponent on each render
            const VariantComponent = renderComponents(variant);
            const key = `${selectedComponent?.name || 'unknown'}-${index}-${variant}`;
            return (
              <div key={key} className="mb-4 border p-2 rounded">
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