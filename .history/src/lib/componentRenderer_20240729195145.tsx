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
  NodeAccordion,
  NodeAvatar,
  NodeAlertDialog
};

function parseProps(attributesString: string) {
  const props: Record<string, string> = {};
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

function createComponent(name: string, props: Record<string, string>, children: React.ReactNode) {
  let Component = componentMap[name as keyof typeof componentMap];
  if (Component) {
    if (Component === ResizableComponent) {
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
    } else {
      return <Element key={Math.random()} is={Component} {...props}>{children}</Element>;
    }
  } else {
    // Handle native HTML elements
    return React.createElement(name, { key: Math.random(), ...props }, children);
  }
}

export function renderComponents(componentsString: string): React.ReactNode[] {
  const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|<(\w+)(\s[^>]*)?\/>|([^<]+)/gs;
  const components: React.ReactNode[] = [];

  let match;
  while ((match = regex.exec(componentsString))) {
    const [, componentName, attributes, children, selfClosingName, selfClosingAttributes, textContent] = match;

    if (componentName || selfClosingName) {
      const name = componentName || selfClosingName;
      const props = parseProps(attributes || selfClosingAttributes || '');

      let childComponents: React.ReactNode[] = [];
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