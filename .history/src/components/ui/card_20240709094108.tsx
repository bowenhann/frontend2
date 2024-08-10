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
import { NodeButton } from './button'; // 假设您有一个 NodeButton 组件

const draggable = true;
const droppable = true;

const createDraggableComponent = (Component: React.ComponentType<any>, isDroppable = false) => {
  return React.forwardRef((props: any, ref: React.Ref<HTMLElement>) => {
    const { connectors: { connect, drag } } = useNode();
    const elementRef = React.useRef<HTMLElement>(null);

    React.useImperativeHandle(ref, () => elementRef.current!);

    React.useEffect(() => {
      if (elementRef.current) {
        connect(isDroppable ? drag(elementRef.current) : elementRef.current);
      }
    }, [connect, drag, isDroppable]);

    return <Component ref={elementRef} {...props} />;
  });
};

export const NodeCardContainer = createDraggableComponent(Card, true);
export const NodeCardHeader = createDraggableComponent(CardHeader, true);
export const NodeCardFooter = createDraggableComponent(CardFooter, true);
export const NodeCardContent = createDraggableComponent(CardContent, true);
export const NodeCardTitle = createDraggableComponent(CardTitle);
export const NodeCardDescription = createDraggableComponent(CardDescription);

export const NodeCard: React.FC<React.ComponentProps<typeof Card>> = (props) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <NodeCardContainer ref={(ref) => connect(drag(ref))} {...props}>
      {props.children || (
        <>
          <Element canvas id="card-header" is={NodeCardHeader}>
            <NodeCardTitle>Card Title</NodeCardTitle>
            <NodeCardDescription>Card Description</NodeCardDescription>
          </Element>
          <Element canvas id="card-content" is={NodeCardContent}>
            <p>Card content goes here</p>
          </Element>
          <Element canvas id="card-footer" is={NodeCardFooter}>
            <NodeButton>Action</NodeButton>
          </Element>
        </>
      )}
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
  related: {
    toolbar: SettingsControl,
  },
};