import { useEditor, Node, Element } from "@craftjs/core";
import React, { useEffect, useState } from "react";

// 导入所有可能用到的组件
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
import { NodeCalendar } from '@/components/node/calendar' // 新增导入
import { ReactIframe } from '@/components/react-iframe'
import { Viewport } from '@/components/viewport'
import { RenderNode } from '@/components/render-node'
import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
import { ResizableComponent } from '@/components/resizableComponent'

import {
	NodeAccordion
	// NodeAccordionItem,
	// NodeAccordionTrigger,
	// NodeAccordionContent
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

const generateRandomTailwindClasses = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const roundedness = ['rounded', 'rounded-md', 'rounded-lg', 'rounded-full'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomRoundedness = roundedness[Math.floor(Math.random() * roundedness.length)];

  return `bg-${randomColor}-500 text-white p-${randomSize} ${randomRoundedness}`;
};

const renderVariant = (componentString: string) => {
  const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|<(\w+)(\s[^>]*)?\/>|([^<]+)/gs;
  
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
      return <Element is={Component} {...props}>{children}</Element>;
    } else {
      return React.createElement(name, props, children);
    }
  }

  let match = regex.exec(componentString);
  if (match) {
    const [, componentName, attributes, children] = match;
    const props = parseProps(attributes);
    return createComponent(componentName, props, children);
  }
  return null;
};

export const ControlPanel = () => {
  const { selected, actions, query } = useEditor((state, query) => ({
    selected: state.events.selected,
  }));

  const [variants, setVariants] = useState<string[]>([]);

  useEffect(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const { type, props } = selectedNode.data;

      // 生成5个变体
      const newVariants = Array(5).fill(null).map(() => {
        const variantClasses = generateRandomTailwindClasses();
        const newProps = { ...props, className: variantClasses };
        return `<${type} ${Object.entries(newProps).map(([key, value]) => `${key}="${value}"`).join(' ')} />`;
      });
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  }, [selected, query]);

  const handleVariantClick = (variantCode: string) => {
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
                {renderVariant(variant)}
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