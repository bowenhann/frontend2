import React from 'react';
import { Element } from '@craftjs/core';
import { ResizableComponent } from '@/components/resizableComponent';
import { DynamicContent } from '@/components/dynamicContent';
import { componentMap } from '@/lib/component-map'

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
<<<<<<< HEAD
      console.log('Creating DynamicContent');
=======
      console.log('Creating DynamicContent',);
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
      return (
        <Element
          key={Math.random()}
          is={DynamicContent}
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
<<<<<<< HEAD
    return React.createElement(name, { key: Math.random(), ...props }, children);
=======
    const processedChildren = children.map(child => {
      if (React.isValidElement(child)) {
        // If the child is already a React element, return it as is
        return child;
      } else if (typeof child === 'string') {
        // If the child is a string, return it as is
        return child;
      } else if (Array.isArray(child)) {
        // If the child is an array, recursively process it
        return child.map(subChild => createComponent(subChild.type, subChild.props, subChild.props.children));
      } else if (typeof child === 'object' && child !== null) {
        // If the child is an object (likely a VDOM representation), convert it to a React element
        return createComponent(child.type, child.props, child.props.children);
      }
      // If it's none of the above, return null (this shouldn't happen in normal circumstances)
      return null;
    }).filter(child => child !== null);
    console.log(`Creating component: ${name}`, processedChildren); // Add logging
    return React.createElement(name, { key: Math.random(), ...props }, ...processedChildren);
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  }
}
// function createComponent(name, props, children) {
//   let Component = componentMap[name];
//   if (Component) {
//     // 为所有组件添加 canvas 属性
//     return (
//       <Element
//         key={Math.random()}
//         is={Component}
//         canvas
//         {...props}
//       >
//         {children}
//       </Element>
//     );
//   } else {
//     // 处理原生 HTML 元素
//     return React.createElement(name, { key: Math.random(), ...props }, children);
//   }
// }

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