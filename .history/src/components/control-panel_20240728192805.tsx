import { useEditor, Node, Element } from "@craftjs/core";
import React, { useEffect, useState } from "react";

// Import all potentially needed components
import { NodeButton } from '@/components/node/button'
import {
  NodeCardHeader,
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardTitle,
  NodeCardFooter
} from '@/components/node/card'
import { NodeAlertDialog } from '@/components/node/alert-dialog'
import { NodeCalendar } from '@/components/node/calendar'
import { ReactIframe } from '@/components/react-iframe'
import { Viewport } from '@/components/viewport'
import { RenderNode } from '@/components/render-node'
import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
import { ResizableComponent } from '@/components/resizableComponent'
import {
  NodeAccordion
} from '@/components/node/accordion'
import { NodeAvatar } from '@/components/node/avatar'

const componentMap = {
  NodeButton,
  NodeCard,
  NodeCardHeader,
  NodeCardTitle,
  NodeCardDescription,
  NodeCardContent,
  NodeCardFooter,
  NodeCalendar,
  NodeAccordion,
  NodeAvatar,
  NodeAlertDialog,
  ResizableComponent,
  div: 'div',
  span: 'span'
};

// Copied renderComponents function from index.tsx
function renderComponents(componentsString) {
  const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|<(\w+)(\s[^>]*)?\/>|([^<]+)/gs;
  const components = [];

  function parseProps(attributesString) {
    const props = {};
    if (attributesString) {
      const attributeRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)"|'([^']*)')/g;
      let attributeMatch;
      while ((attributeMatch = attributeRegex.exec(attributesString))) {
        const [, name, jsValue, doubleQuotedValue, singleQuotedValue] = attributeMatch;
        if (name === 'className') {
          props[name] = `${props[name] || ''} ${jsValue || doubleQuotedValue || singleQuotedValue}`.trim();
        } else {
          props[name] = jsValue || doubleQuotedValue || singleQuotedValue;
        }
      }
    }
    return props;
  }

  function createComponent(name, props, children) {
    let Component = componentMap[name];
    if (Component) {
      if (Component === ResizableComponent) {
        return (
          <Element
            key={components.length}
            is={ResizableComponent}
            canvas
            {...props}
          >
            {children}
          </Element>
        );
      } else {
        return <Element key={components.length} is={Component} {...props}>{children}</Element>;
      }
    } else {
      // Handle native HTML elements
      return React.createElement(name, { key: components.length, ...props }, children);
    }
  }

  let match;
  while ((match = regex.exec(componentsString))) {
    const [, componentName, attributes, children, selfClosingName, selfClosingAttributes, textContent] = match;

    if (componentName || selfClosingName) {
      const name = componentName || selfClosingName;
      const props = parseProps(attributes || selfClosingAttributes);

      let childComponents = [];
      if (children) {
        childComponents = renderComponents(children);
      }

      components.push(createComponent(name, props, childComponents));
    } else if (textContent) {
      components.push(textContent.trim());
    }
  }

  return components;
}

const generateRandomTailwindClasses = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const roundedness = ['rounded', 'rounded-md', 'rounded-lg', 'rounded-full'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomRoundedness = roundedness[Math.floor(Math.random() * roundedness.length)];

  return `bg-${randomColor}-500 text-white p-${randomSize} ${randomRoundedness}`;
};

export const ControlPanel = () => {
  const { selected, actions, query } = useEditor((state, query) => ({
    selected: state.events.selected,
  }));

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const { type, props } = selectedNode.data;

      // Generate 5 variants
      const newVariants = Array(5).fill(null).map(() => {
        const variantClasses = generateRandomTailwindClasses();
        const newProps = { ...props, className: variantClasses };
        return `<${type} ${Object.entries(newProps).map(([key, value]) => `${key}="${value}"`).join(' ')}>${props.children || ''}</${type}>`;
      });
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  }, [selected, query]);

  const handleVariantClick = (variantCode) => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const classMatch = variantCode.match(/className="([^"]*)"/);
      if (classMatch) {
        actions.setProp(selectedNodeId, (props) => {
          props.className = classMatch[1];
        });
      }
    }
  };

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {selected.size > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
          {variants.map((variant, index) => (
            <div key={index} className="mb-4 border p-2 rounded">
              <div className="mb-2">
                {renderComponents(variant)}
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
      )}
    </div>
  );
};