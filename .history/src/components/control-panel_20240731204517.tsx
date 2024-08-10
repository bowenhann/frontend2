import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState, useCallback } from "react";
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

// ... keep the getComponentName, generateComponentString, and renderComponents functions as they were ...

export const ControlPanel = () => {
  const { active, related, actions, query } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [variants, setVariants] = useState([]);
  const [editorKey, setEditorKey] = useState(0);

  const generateVariants = useCallback((node) => {
    if (node) {
      const { type, props, nodes } = node.data;
      const baseString = generateComponentString(type, props, props.children || '');
      
      // Generate 5 variants with different styles
      const newVariants = Array(5).fill(null).map((_, index) => {
        const variantProps = { ...props, className: `variant-${index + 1}` };
        return generateComponentString(type, variantProps, props.children || '');
      });

      return [baseString, ...newVariants];
    }
    return [];
  }, []);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      const node = query.node(active).get();
      const newVariants = generateVariants(node);
      setVariants(newVariants);
      setEditorKey(prevKey => prevKey + 1); // Force re-render of Editor components
    } else {
      setVariants([]);
    }
  }, [active, query, generateVariants]);

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
              <div key={`${active}-${index}`} className="mb-4 border p-2 rounded">
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