import React from 'react';
import JsxParser from 'react-jsx-parser';
import { Element, useNode } from '@craftjs/core';

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
// Create a wrapper for Element to handle Craft.js specific props
const CraftElement = (props) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}>
      <Element {...props} />
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
  // Function to bind Craft.js props to components
  const bindComponent = (Component) => (props) => {
    const { connectors: { connect, drag } } = useNode();
    return (
      <div ref={ref => connect(drag(ref))}>
        <Component {...props} />
      </div>
    );
  };

  // Wrap all components with Craft.js bindings
  const wrappedComponents = Object.entries(componentMap).reduce((acc, [key, Component]) => {
    acc[key] = key === 'Element' ? Component : bindComponent(Component);
    return acc;
  }, {});

  return (
    <JsxParser
      jsx={jsx}
      components={wrappedComponents}
      onError={onError}
      renderError={({ error }) => <div>Error: {error.message}</div>}
      renderInWrapper={false}
      allowUnknownElements={false}
      bindings={{
        useNode,
        // Add other necessary bindings here
      }}
    />
  );
};

export default CustomJsxParser;