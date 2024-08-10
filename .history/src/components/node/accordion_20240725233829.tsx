import React from 'react';
import { useNode, Element } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';
import { AccordionSettings, AccordionItemSettings, AccordionTriggerSettings, AccordionContentSettings } from '@/components/settings/accordion';

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
    <Element id="accordion-root" is={Accordion} {...props} ref={(ref: any) => connect(drag(ref))}>
      {children}
    </Element>
  );
};

NodeAccordion.craft = {
  displayName: 'Accordion',
  props: {
    type: 'single',
    collapsible: true,
  },
  rules: {
    canMoveIn: (incomingNodes) => incomingNodes.every((node: any) => node.data.type === NodeAccordionItem),
  },
  related: {
    toolbar: AccordionSettings,
  },
};

export const NodeAccordionItem: CraftComponent<React.ComponentProps<typeof AccordionItem>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <Element id={`accordion-item-${props.value || 'default'}`} is={AccordionItem} {...props} ref={connect as React.Ref<HTMLDivElement>}>
      {children}
    </Element>
  );
};

NodeAccordionItem.craft = {
  displayName: 'Accordion Item',
  props: {
    value: 'item-1',
  },
  rules: {
    canMoveIn: (incomingNodes) => 
      incomingNodes.every((node: any) => 
        node.data.type === NodeAccordionTrigger || node.data.type === NodeAccordionContent
      ),
  },
  related: {
    toolbar: AccordionItemSettings,
  },
};

export const NodeAccordionTrigger: CraftComponent<React.ComponentProps<typeof AccordionTrigger>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <Element id={`accordion-trigger-${props.value || 'default'}`} is={AccordionTrigger} {...props} ref={connect as React.Ref<HTMLButtonElement>}>
      {children}
    </Element>
  );
};

NodeAccordionTrigger.craft = {
  displayName: 'Accordion Trigger',
  props: {
    children: 'Accordion Trigger',
  },
  related: {
    toolbar: AccordionTriggerSettings,
  },
};

export const NodeAccordionContent: CraftComponent<React.ComponentProps<typeof AccordionContent>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <Element id={`accordion-content-${props.value || 'default'}`} is={AccordionContent} {...props} ref={connect as React.Ref<HTMLDivElement>}>
      <Element id={`accordion-content-inner-${props.value || 'default'}`} canvas>
        {children}
      </Element>
    </Element>
  );
};

NodeAccordionContent.craft = {
  displayName: 'Accordion Content',
  props: {
    children: 'Accordion Content',
  },
  related: {
    toolbar: AccordionContentSettings,
  },
};