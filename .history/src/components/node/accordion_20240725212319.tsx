import React from 'react';
import { useNode, Element } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';

// NodeAccordion
export const NodeAccordion: React.FC<React.ComponentProps<typeof Accordion>> = ({ children, ...props }) => {
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
    canMoveIn: (incomingNodes) => incomingNodes.every((node) => node.data.type === NodeAccordionItem),
  },
  related: {
    toolbar: SettingsControl,
  },
};

// NodeAccordionItem
export const NodeAccordionItem: React.FC<React.ComponentProps<typeof AccordionItem>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <AccordionItem ref={connect} {...props}>
      {children}
    </AccordionItem>
  );
};

NodeAccordionItem.craft = {
  displayName: 'Accordion Item',
  props: {},
  rules: {
    canMoveIn: (incomingNodes) => 
      incomingNodes.every((node) => 
        node.data.type === NodeAccordionTrigger || node.data.type === NodeAccordionContent
      ),
  },
  related: {
    toolbar: SettingsControl,
  },
};

// NodeAccordionTrigger
export const NodeAccordionTrigger: React.FC<React.ComponentProps<typeof AccordionTrigger>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <AccordionTrigger ref={connect} {...props}>
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
export const NodeAccordionContent: React.FC<React.ComponentProps<typeof AccordionContent>> = ({ children, ...props }) => {
  const { connectors: { connect } } = useNode();
  return (
    <AccordionContent ref={connect} {...props}>
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