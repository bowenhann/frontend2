import React from 'react';
import { useNode, Element } from '@craftjs/core';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from '@/components/ui/menubar';
import { SettingsControl } from '@/components/settings-control';

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

export const NodeMenubar = createDraggableComponent(Menubar, true);
export const NodeMenubarMenu = createDraggableComponent(MenubarMenu, true);
export const NodeMenubarTrigger = createDraggableComponent(MenubarTrigger);
export const NodeMenubarContent = createDraggableComponent(MenubarContent, true);
export const NodeMenubarItem = createDraggableComponent(MenubarItem);
export const NodeMenubarSeparator = createDraggableComponent(MenubarSeparator);
export const NodeMenubarShortcut = createDraggableComponent(MenubarShortcut);
export const NodeMenubarSub = createDraggableComponent(MenubarSub, true);
export const NodeMenubarSubContent = createDraggableComponent(MenubarSubContent, true);
export const NodeMenubarSubTrigger = createDraggableComponent(MenubarSubTrigger);
export const NodeMenubarCheckboxItem = createDraggableComponent(MenubarCheckboxItem);
export const NodeMenubarRadioGroup = createDraggableComponent(MenubarRadioGroup, true);
export const NodeMenubarRadioItem = createDraggableComponent(MenubarRadioItem);

export const NodeMenubarComponent: CraftComponent = () => {
  const { connectors: { connect, drag } } = useNode();

  const defaultContent = (
    <>
      <Element canvas is={NodeMenubarMenu}>
        <NodeMenubarTrigger>File</NodeMenubarTrigger>
        <Element canvas is={NodeMenubarContent}>
          <NodeMenubarItem>
            New Tab <NodeMenubarShortcut>⌘T</NodeMenubarShortcut>
          </NodeMenubarItem>
          <NodeMenubarItem>New Window</NodeMenubarItem>
          <NodeMenubarSeparator />
          <NodeMenubarItem>Share</NodeMenubarItem>
          <NodeMenubarSeparator />
          <NodeMenubarItem>Print</NodeMenubarItem>
        </Element>
      </Element>
      <Element canvas is={NodeMenubarMenu}>
        <NodeMenubarTrigger>Edit</NodeMenubarTrigger>
        <Element canvas is={NodeMenubarContent}>
          <NodeMenubarItem>
            Undo <NodeMenubarShortcut>⌘Z</NodeMenubarShortcut>
          </NodeMenubarItem>
          <NodeMenubarItem>
            Redo <NodeMenubarShortcut>⌘Y</NodeMenubarShortcut>
          </NodeMenubarItem>
          <NodeMenubarSeparator />
          <Element canvas is={NodeMenubarSub}>
            <NodeMenubarSubTrigger>More</NodeMenubarSubTrigger>
            <Element canvas is={NodeMenubarSubContent}>
              <NodeMenubarItem>Save</NodeMenubarItem>
              <NodeMenubarItem>Save As</NodeMenubarItem>
            </Element>
          </Element>
        </Element>
      </Element>
    </>
  );

  return (
    <NodeMenubar
      ref={(ref: HTMLElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
    >
      {defaultContent}
    </NodeMenubar>
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

addCraftConfig(NodeMenubarComponent, 'Menubar');
addCraftConfig(NodeMenubarMenu, 'Menubar Menu');
addCraftConfig(NodeMenubarTrigger, 'Menubar Trigger');
addCraftConfig(NodeMenubarContent, 'Menubar Content');
addCraftConfig(NodeMenubarItem, 'Menubar Item');
addCraftConfig(NodeMenubarSeparator, 'Menubar Separator');
addCraftConfig(NodeMenubarShortcut, 'Menubar Shortcut');
addCraftConfig(NodeMenubarSub, 'Menubar Sub');
addCraftConfig(NodeMenubarSubContent, 'Menubar Sub Content');
addCraftConfig(NodeMenubarSubTrigger, 'Menubar Sub Trigger');
addCraftConfig(NodeMenubarCheckboxItem, 'Menubar Checkbox Item');
addCraftConfig(NodeMenubarRadioGroup, 'Menubar Radio Group');
addCraftConfig(NodeMenubarRadioItem, 'Menubar Radio Item');

NodeMenubarComponent.craft = {
  ...NodeMenubarComponent.craft,
  props: {
    className: 'p-2',
  },
  custom: {
    importPath: '@/components/menubar',
  },
};
