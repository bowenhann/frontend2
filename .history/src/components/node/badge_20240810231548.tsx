// import React from 'react';
// import { useNode } from '@craftjs/core';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { BadgeSettings } from '@/components/settings/badge';

// export const NodeBadge = ({
//   children = 'Badge',
//   variant = 'default',
//   className,
//   ...props
// }) => {
//   const { connectors: { connect, drag } } = useNode();

//   return (
//     <Badge
//       ref={(ref) => connect(drag(ref)) as any}
//       variant={variant as any}
//       className={cn(className)}
//       {...props}
//     >
//       {children}
//     </Badge>
//   );
// };

// NodeBadge.craft = {
//   displayName: 'Badge',
//   props: {
//     children: 'Badge',
//     variant: 'default',
//   },
//   related: {
//     toolbar: BadgeSettings,
//   },
// };



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

interface CraftComponentProps {
  displayName: string;
  props: Record<string, any>;
  related: {
    toolbar: React.ComponentType<any>;
  };
  custom?: Record<string, any>;
}

type CraftComponent<P = {}> = React.FC<P> & {
  craft: CraftComponentProps;
};

interface NodeCardProps extends React.ComponentProps<typeof NodeCardContainer> {
  children?: React.ReactNode;
}


const createDraggableComponent = (Component: React.ComponentType<any>, isDroppable = false) => {
  const DraggableComponent = React.forwardRef((props: any, ref: React.Ref<HTMLElement>) => {
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

  const originalName = Component.displayName || Component.name || 'Component';
  DraggableComponent.displayName = `Draggable${originalName}`;

  return DraggableComponent;
};

export const NodeCardContainer = createDraggableComponent(Card, true);
export const NodeCardHeader = createDraggableComponent(CardHeader, true);
export const NodeCardFooter = createDraggableComponent(CardFooter, true);
export const NodeCardContent = createDraggableComponent(CardContent, true);
export const NodeCardTitle = createDraggableComponent(CardTitle);
export const NodeCardDescription = createDraggableComponent(CardDescription);

export const NodeCard: CraftComponent<NodeCardProps> = (props) => {
  const { connectors: { connect, drag } } = useNode();
  
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

  return (
    <NodeCardContainer
    
      ref={(ref: HTMLElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      {...props}
    >
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