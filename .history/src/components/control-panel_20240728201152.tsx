import React, { useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";

const generateVariantStyle = (originalStyle) => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const roundedness = ['rounded', 'rounded-md', 'rounded-lg', 'rounded-full'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomRoundedness = roundedness[Math.floor(Math.random() * roundedness.length)];

  // Combine original classes with new random classes
  const newClasses = `bg-${randomColor}-500 text-white p-${randomSize} ${randomRoundedness}`;
  return originalStyle.className 
    ? `${originalStyle.className} ${newClasses}`
    : newClasses;
};

export const ControlPanel = () => {
  const { selected, actions, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [variants, setVariants] = useState([]);
  const [originalComponent, setOriginalComponent] = useState(null);

  useEffect(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const { type, props } = selectedNode.data;

      setOriginalComponent({ type, props });

      // Generate 5 variants
      const newVariants = Array(5).fill(null).map(() => ({
        ...props,
        className: generateVariantStyle(props)
      }));
      setVariants(newVariants);
    } else {
      setVariants([]);
      setOriginalComponent(null);
    }
  }, [selected, query]);

  const handleVariantClick = (variantProps) => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      actions.setProp(selectedNodeId, (props) => {
        props.className = variantProps.className;
      });
    }
  };

  const renderComponent = (type, props) => {
    const Component = type;
    return <Component {...props} />;
  };

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {selected.size > 0 && originalComponent ? (
        <div className="p-4">
          <h4 className="text-sm font-semibold mt-4 mb-2">Original Component:</h4>
          <div className="mb-4 border p-2 rounded">
            {renderComponent(originalComponent.type, originalComponent.props)}
          </div>
          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
          {variants.map((variant, index) => (
            <div key={index} className="mb-6 border p-2 rounded">
              <div className="mb-2">
                {renderComponent(originalComponent.type, variant)}
              </div>
              <button 
                className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200 text-xs mb-2"
                onClick={() => handleVariantClick(variant)}
              >
                Apply This Style
              </button>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                <code>{`className="${variant.className}"`}</code>
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