import React from 'react';
import { Element } from '@craftjs/core';
import { ResizableComponent } from '@/components/resizableComponent';
import { NodeButton } from '@/components/node/button';
import {
  NodeCardHeader,
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardTitle,
  NodeCardFooter
} from '@/components/node/card';
import { NodeCalendar } from '@/components/node/calendar';
import { NodeAccordion } from '@/components/node/accordion';
import { NodeAvatar } from '@/components/node/avatar';
import { NodeAlertDialog } from '@/components/node/alert-dialog';
import { NodeAlert } from '@/components/node/alert';
import { ResizablePanelLayout } from '@/components/resizablePanelLayout';
import { DynamicContent } from '@/components/dynamicContent';

const componentMap = {
  NodeButton,
  NodeCard,
  NodeCardHeader,
  NodeCardTitle,
  NodeCardDescription,
  NodeCardContent,
  NodeCardFooter,
  NodeCalendar,
  div: 'div',
  span: 'span',
  ResizableComponent,
  ResizablePanelLayout,
  NodeAccordion,
  NodeAvatar,
  NodeAlertDialog,
  NodeAlert,
  DynamicContent,
};

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
    if (Component === ResizableComponent ) {
      return (
        <Element
          key={Math.random()}
          is={ResizableComponent}
          canvas
          {...props}
        >
          {children}
        </Element>
      );
    } else if (Component === DynamicContent) {
      return (
        <Element
          key={Math.random()}
          canvas
          {...props}
        >
          {children}
        </Element>
      );
    }
    
    {
      return <Element key={Math.random()} is={Component} canvas {...props}>{children}</Element>;
    }
  } else {
    // Handle native HTML elements
    return React.createElement(name, { key: Math.random(), ...props }, children);
  }
}

export function renderComponents(componentsString) {
  const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|<(\w+)(\s[^>]*)?\/>|([^<]+)/gs;
  const components = [];

  let match;
  while ((match = regex.exec(componentsString))) {
    const [, componentName, attributes, children, selfClosingName, selfClosingAttributes, textContent] = match;

    if (componentName || selfClosingName) {
      const name = componentName || selfClosingName;
      const props = parseProps(attributes || selfClosingAttributes);
      console.log(`Creating component: ${name}`); // 添加日志


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