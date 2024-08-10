import React from 'react';
import { useNode, Element } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';

// 定义 CraftComponent 类型
type CraftComponent<T = {}> = React.FC<T> & {
  craft?: {
    displayName: string;
    props?: Record<string, any>;
    rules?: {
      canMoveIn?: (incomingNodes: any[]) => boolean;
    };
    related?: {
      toolbar: React.ComponentType<any>;
    };
  };
};

// NodeAccordion
export const NodeAccordion: CraftComponent<React.ComponentProps<typeof Accordion>> = ({ children, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Accordion ref={(ref: any) => connect(drag(ref))} {...props}>
      {children}
    </Accordion>
  );
};

NodeAccordion.craft = {
  displayName: 'Accordion',
  props: {},
  rules: {
    canMoveIn: (incomingNodes) => incomingNodes.every((node: any) => node.data.type === NodeAccordionItem),
  },
  related: {
    toolbar: SettingsControl,
  },
};

// NodeAccordionItem
export const NodeAccordionItem: CraftComponent<React.ComponentProps<typeof AccordionItem>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <AccordionItem ref={connect as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </AccordionItem>
  );
};

NodeAccordionItem.craft = {
  displayName: 'Accordion Item',
  props: {},
  rules: {
    canMoveIn: (incomingNodes) => 
      incomingNodes.every((node: any) => 
        node.data.type === NodeAccordionTrigger || node.data.type === NodeAccordionContent
      ),
  },
  related: {
    toolbar: SettingsControl,
  },
};

// NodeAccordionTrigger
export const NodeAccordionTrigger: CraftComponent<React.ComponentProps<typeof AccordionTrigger>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <AccordionTrigger ref={connect as React.Ref<HTMLButtonElement>} {...props}>
      {children}
    </AccordionTrigger>
  );
};

NodeAccordionTrigger.craft = {
  displayName: 'Accordion Trigger',
  props: {},
  related: {
    toolbar: SettingsControl,
  },
};

// NodeAccordionContent
export const NodeAccordionContent: CraftComponent<React.ComponentProps<typeof AccordionContent>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <AccordionContent ref={connect as React.Ref<HTMLDivElement>} {...props}>
      <Element id="accordion-content" canvas>
        {children}
      </Element>
    </AccordionContent>
  );
};

NodeAccordionContent.craft = {
  displayName: 'Accordion Content',
  props: {},
  related: {
    toolbar: SettingsControl,
  },
};