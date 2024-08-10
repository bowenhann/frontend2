

// Import your components
import { NodeButton } from '@/components/node/button'
import {
	NodeCardHeader,
	NodeCard,
	NodeCardContent,
	NodeCardDescription,
	NodeCardTitle,
	NodeCardFooter
} from '@/components/node/card'
import { NodeCalendar } from '@/components/node/calendar' // 新增导入
import { ResizableComponent } from '@/components/resizableComponent'

import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Element, useNode } from '@craftjs/core';

// Import your components
import { NodeButton, NodeCard, NodeCardHeader, NodeCardTitle, NodeCardDescription, NodeCardContent, NodeCardFooter, NodeCalendar, ResizableComponent } from './your-components-file';

// Create a wrapper for Element to handle Craft.js specific props
const CraftElement = ({ is: Component, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}>
      <Element {...props} component={Component} />
    </div>
  );
};

// Custom components map
const componentMap = {
  Element: CraftElement,
  NodeButton,
  NodeCard,
  NodeCardHeader,
  NodeCardTitle,
  NodeCardDescription,
  NodeCardContent,
  NodeCardFooter,
  NodeCalendar,
  ResizableComponent,
  // Add other custom components here
};

// Custom JSX Parser component
const CustomJsxParser = ({ jsx, onError }) => {
  const parseOptions = {
    replace: (domNode) => {
      if (domNode.type === 'tag') {
        const Component = componentMap[domNode.name];
        if (Component) {
          const props = { ...domNode.attribs };
          
          // Handle the 'is' prop for Element components
          if (domNode.name === 'Element' && props.is) {
            props.is = componentMap[props.is] || props.is;
          }

          // Handle className for Tailwind
          if (props.className) {
            props.className = props.className.trim();
          }

          // Handle child elements
          if (domNode.children && domNode.children.length > 0) {
            return (
              <Component {...props}>
                {domToReact(domNode.children, parseOptions)}
              </Component>
            );
          }

          return <Component {...props} />;
        }
      }
    }
  };

  try {
    return <>{parse(jsx, parseOptions)}</>;
  } catch (error) {
    if (onError) {
      onError(error);
    }
    return <div>Error parsing JSX: {error.message}</div>;
  }
};

export default CustomJsxParser;