import React, { useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";

const generateRandomStyle = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const sizes = ['0.5rem', '1rem', '1.5rem', '2rem'];
  const borderRadii = ['0.25rem', '0.5rem', '1rem', '9999px'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomBorderRadius = borderRadii[Math.floor(Math.random() * borderRadii.length)];

  return {
    backgroundColor: randomColor,
    color: 'white',
    padding: randomSize,
    borderRadius: randomBorderRadius,
    border: 'none',
    cursor: 'pointer'
  };
};

export const ControlPanel = () => {
  const { selected, actions, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const { props } = selectedNode.data;

      // Generate 5 variants
      const newVariants = Array(5).fill(null).map(() => {
        const variantStyle = generateRandomStyle();
        return { ...props, style: variantStyle };
      });
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  }, [selected, query]);

  const handleVariantClick = (variantProps) => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      actions.setProp(selectedNodeId, (props) => {
        props.style = variantProps.style;
      });
    }
  };

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {selected.size > 0 ? (
        <div className="p-4">
          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
          {variants.map((variant, index) => (
            <div key={index} className="mb-4 border p-2 rounded">
              <div className="mb-2">
                <button style={variant.style}>
                  {variant.children || 'Button'}
                </button>
              </div>
              <button 
                className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                onClick={() => handleVariantClick(variant)}
              >
                Apply This Style
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4">
          <p>Select an element to see variants</p>
        </div>
      )}
    </div>
  );
};