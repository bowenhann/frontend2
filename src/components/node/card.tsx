// @/components/node/card.tsx
import React from 'react';
<<<<<<< HEAD
import { useNode, Element } from '@craftjs/core';
=======
import { useNode } from '@craftjs/core';
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
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
<<<<<<< HEAD

interface NodeCardProps extends CraftNodeProps, React.ComponentProps<typeof NodeCardContainer> {
=======
import { CardSettings, CardTitleSettings, CardDescriptionSettings, CardContentSettings, CardFooterSettings } from '@/components/settings/card';

interface NodeCardProps extends CraftNodeProps {
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  title?: string;
  description?: string;
  content?: string;
  footerButtonText?: string;
<<<<<<< HEAD
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
=======
  className?: string;
}

const NodeCardContainer = createDraggableComponent(Card, true);
const NodeCardHeader = createDraggableComponent(CardHeader, true);
const NodeCardFooter = createDraggableComponent(CardFooter, true);
const NodeCardContent = createDraggableComponent(CardContent, true);
const NodeCardTitle = createDraggableComponent(CardTitle);
const NodeCardDescription = createDraggableComponent(CardDescription);

const NodeCard: CraftComponent<NodeCardProps> = ({
  children,
  title,
  description,
  content,
  footerButtonText,
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  className = 'w-full',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();
<<<<<<< HEAD
  
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
=======

  const renderContent = () => {
    if (React.Children.count(children) > 0) {
      return children;
    }

    return (
      <>
        {(title || description) && (
          <NodeCardHeader>
            {title && <NodeCardTitle>{title}</NodeCardTitle>}
            {description && <NodeCardDescription>{description}</NodeCardDescription>}
          </NodeCardHeader>
        )}
        {content && <NodeCardContent>{content}</NodeCardContent>}
        {footerButtonText && (
          <NodeCardFooter>
            <Button className="w-full">{footerButtonText}</Button>
          </NodeCardFooter>
        )}
      </>
    );
  };

  return (
    <NodeCardContainer
      ref={(ref: HTMLElement | null) => ref && connect(drag(ref)) as any}
      className={className}
      {...props}
    >
      {renderContent()}
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
    </NodeCardContainer>
  );
};

<<<<<<< HEAD
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
=======
NodeCard.craft = {
  displayName: 'Card',
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  props: {
    className: 'p-6 m-2',
    title: 'Card Title',
    description: 'Card Description',
    content: 'Empty Container',
    footerButtonText: 'Footer button',
  },
<<<<<<< HEAD
  custom: {
    importPath: '@/components/card',
  },
};
=======
  related: {
    toolbar: CardSettings,
  },
  custom: {
    importPath: '@/components/card',
  },
};

export { NodeCard, NodeCardHeader, NodeCardFooter, NodeCardContent, NodeCardTitle, NodeCardDescription };

// 为子组件添加 craft 配置
const addCraftConfig = (component: any, displayName: string, defaultProps: any, ToolbarComponent: React.ComponentType<any>) => {
  component.craft = {
    displayName,
    props: defaultProps,
    related: {
      toolbar: ToolbarComponent,
    },
  };
};

addCraftConfig(NodeCardTitle, 'Card Title', { children: 'Card Title' }, CardTitleSettings);
addCraftConfig(NodeCardDescription, 'Card Description', { children: 'Card Description' }, CardDescriptionSettings);
addCraftConfig(NodeCardContent, 'Card Content', { children: 'Card Content' }, CardContentSettings);
addCraftConfig(NodeCardFooter, 'Card Footer', { children: <Button className="w-full">Footer Button</Button> }, CardFooterSettings);
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
