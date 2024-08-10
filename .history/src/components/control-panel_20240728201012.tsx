import React, { useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";

const generateVariant = (originalStyle) => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const roundedness = ['rounded', 'rounded-md', 'rounded-lg', 'rounded-full'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomRoundedness = roundedness[Math.floor(Math.random() * roundedness.length)];

  // Start with the original style
  const variantStyle = { ...originalStyle };

  // Modify only certain properties
  variantStyle.backgroundColor = randomColor;
  variantStyle.padding = `var(--padding-${randomSize})`;
  variantStyle.borderRadius = `var(--${randomRoundedness})`;

  return variantStyle;
};

const styleToString = (style) => {
  return Object.entries(style)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
    .join(" ");
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

      // Generate 5 variants based on the original style
      const originalStyle = props.style || {};
      const newVariants = Array(5).fill(null).map(() => ({
        ...props,
        style: generateVariant(originalStyle)
      }));
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
            <div key={index} className="mb-6 border p-2 rounded">
              <div className="mb-2">
                <button className={variant.className} style={variant.style}>
                  {variant.children || 'Button'}
                </button>
              </div>
              <button 
                className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200 text-xs mb-2"
                onClick={() => handleVariantClick(variant)}
              >
                Apply This Style
              </button>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                <code>{`style="${styleToString(variant.style)}"`}</code>
              </pre>
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