import { useEditor, Editor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { renderComponents } from '@/lib/componentRenderer'; // Make sure this path is correct
import { VariantCanvas } from './VariantCanvas'; // Import the new VariantCanvas

export const ControlPanel = () => {
  const { active, related, actions } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }));

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (active && active !== 'ROOT') {
      // For now, we'll just create a single variant
      setVariants(['<NodeButton>Button 2</NodeButton>']);
    } else {
      setVariants([]);
    }
  }, [active]);

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
              <div className="mb-2" style={{ height: '100px' }}>
                <Editor resolver={{ Button: renderComponents(variant) }}>
                  <VariantCanvas>
                    {renderComponents(variant)}
                  </VariantCanvas>
                </Editor>
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mb-2">
                <code>{variant}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
      {active && related?.toolbar && React.createElement(related.toolbar)}
    </div>
  );
};