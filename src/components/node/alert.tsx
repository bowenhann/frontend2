import React from 'react';
import { useNode } from '@craftjs/core';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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

export const NodeAlert = createDraggableComponent(Alert, true);
export const NodeAlertTitle = createDraggableComponent(AlertTitle);
export const NodeAlertDescription = createDraggableComponent(AlertDescription);

export const NodeAlertComponent = ({
  title = 'Alert Title',
  description = 'Alert Description',
  variant = 'default',
  ...props
}) => {
  return (
    <NodeAlert variant={variant} {...props}>
      <NodeAlertTitle>{title}</NodeAlertTitle>
      <NodeAlertDescription>{description}</NodeAlertDescription>
    </NodeAlert>
  );
};

NodeAlertComponent.craft = {
  displayName: 'Alert',
  props: {
    title: 'Alert Title',
    description: 'Alert Description',
    variant: 'default',
  },
  related: {
    toolbar: () => { /* ... */ },
  },
};