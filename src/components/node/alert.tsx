<<<<<<< HEAD
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
=======
// @/components/node/alert.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertSettings } from '@/components/settings/alert';

export const NodeAlert = ({ children, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Alert 
      {...props} 
      ref={(ref) => ref && connect(drag(ref)) as any}
    >
      {children}
    </Alert>
  );
};

export const NodeAlertTitle = ({ children, ...props }) => {
  return <AlertTitle {...props}>{children}</AlertTitle>;
};

export const NodeAlertDescription = ({ children, ...props }) => {
  return <AlertDescription {...props}>{children}</AlertDescription>;
};

NodeAlert.craft = {
  displayName: 'Alert',
  props: {
    variant: 'default',
    children: [
      {
        type: NodeAlertTitle,
        props: { children: 'Alert Title' }
      },
      {
        type: NodeAlertDescription,
        props: { children: 'Alert Description' }
      }
    ],
  },
  related: {
    toolbar: AlertSettings,
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  },
};