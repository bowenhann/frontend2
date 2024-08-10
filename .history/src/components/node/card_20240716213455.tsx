import React from 'react';
import { useNode, Element } from '@craftjs/core';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { SettingsControl } from '@/components/settings-control';
import { NodeButton } from './button'; // 假设按钮组件在同一目录
import createDraggableComponent  from '@/components/global/create-draggable-component';


// 定义 Craft 属性的类型
interface CraftComponent<T = any> extends React.FC<T> {
  craft?: {
    displayName?: string;
    props?: Record<string, any>;
    related?: {
      toolbar?: React.ComponentType<any>;
    };
    custom?: Record<string, any>;
  };
}

export const NodeCardContainer = createDraggableComponent(Card, true);
export const NodeCardHeader = createDraggableComponent(CardHeader, true);
export const NodeCardFooter = createDraggableComponent(CardFooter, true);
export const NodeCardContent = createDraggableComponent(CardContent, true);
export const NodeCardTitle = createDraggableComponent(CardTitle);
export const NodeCardDescription = createDraggableComponent(CardDescription);

// export const NodeCard: React.FC<React.ComponentProps<typeof Card>> = (props) => {
  const NodeCard: CraftComponent<React.ComponentProps<typeof Card>> = (props) => {
  const { connectors: { connect, drag } } = useNode();

  const cardRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        connect(drag(node));
      }
    },
    [connect, drag]
  );
  
  const defaultContent = (
    <>
      <Element
        canvas
        id="card-header"
        is={NodeCardHeader}
      >
        <NodeCardTitle>Card Title</NodeCardTitle>
        <NodeCardDescription>Card Description</NodeCardDescription>
      </Element>
      <Element
        canvas
        id="card-content"
        is={NodeCardContent}
      >
        {/* 默认内容可以为空，或者添加一些占位文本 */}
      </Element>
      <Element
        canvas
        id="card-footer"
        is={NodeCardFooter}
      >
        <NodeButton>Footer button</NodeButton>
      </Element>
    </>
  );

  // return (
  //   <NodeCardContainer ref={(ref) => connect(drag(ref))} {...props}>
  //     {props.children || defaultContent}
  //   </NodeCardContainer>
  // );

  return (
    <NodeCardContainer ref={cardRef} {...props}>
      {props.children || defaultContent}
    </NodeCardContainer>
  );
};

const addCraftConfig = (component: any, displayName: string) => {
  component.craft = {
    displayName,
    props: {},
    related: {
      toolbar: SettingsControl,
    },
  };
};

addCraftConfig(NodeCard, 'Card');
addCraftConfig(NodeCardHeader, 'Card Header');
addCraftConfig(NodeCardFooter, 'Card Footer');
addCraftConfig(NodeCardContent, 'Card Content');
addCraftConfig(NodeCardTitle, 'Card Title');
addCraftConfig(NodeCardDescription, 'Card Description');

NodeCard.craft = {
  ...NodeCard.craft,
  props: {
    className: 'p-6 m-2',
  },
  custom: {
    importPath: '@/components/card',
  },
};