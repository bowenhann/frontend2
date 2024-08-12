// @/components/node/card.tsx
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
import { Button } from '@/components/ui/button';
import { SettingsControl } from '@/components/settings-control';
import { createDraggableComponent } from '@/components/create-draggable-component';
import { CraftComponent, CraftNodeProps } from '@/types/craft';

interface NodeCardProps extends CraftNodeProps, React.ComponentProps<typeof NodeCardContainer> {
  title?: string;
  description?: string;
  content?: string;
  footerButtonText?: string;
}

export const NodeCardContainer = createDraggableComponent(Card, true);
export const NodeCardHeader = createDraggableComponent(CardHeader, true);
export const NodeCardFooter = createDraggableComponent(CardFooter, true);
export const NodeCardContent = createDraggableComponent(CardContent, true);
export const NodeCardTitle = createDraggableComponent(CardTitle);
export const NodeCardDescription = createDraggableComponent(CardDescription);

export const NodeCard: CraftComponent<NodeCardProps> = ({
  children,
  title = 'Card Title',
  description = 'Card Description',
  content = 'Empty Container',
  footerButtonText = 'Footer button',
  className = 'w-full',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();
  
  const defaultContent = (
    <>
      <NodeCardHeader>
        <NodeCardTitle>{title}</NodeCardTitle>
        <NodeCardDescription>{description}</NodeCardDescription>
      </NodeCardHeader>
      <NodeCardContent>{content}</NodeCardContent>
      <NodeCardFooter>
        <Button className="w-full">{footerButtonText}</Button>
      </NodeCardFooter>
    </>
  );

  return (
    <NodeCardContainer
      ref={(ref: HTMLElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className={className}
      {...props}
    >
      {children || defaultContent}
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
    title: 'Card Title',
    description: 'Card Description',
    content: 'Empty Container',
    footerButtonText: 'Footer button',
  },
  custom: {
    importPath: '@/components/card',
  },
};