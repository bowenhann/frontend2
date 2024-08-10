import React from 'react';
import { useNode, Element } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';
import { AccordionSettings } from '@/components/settings/accordion';
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
export const NodeAccordion: CraftComponent<React.ComponentProps<typeof Accordion>> = ({ 
  type = 'single',
  collapsible = false,
  defaultValue = '',
  disabled = false,
  items = [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.' }],
  ...props 
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Accordion 
      ref={(ref: any) => connect(drag(ref))} 
      type={type}
      collapsible={type === 'single' ? collapsible : undefined}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      disabled={disabled}
      {...props}
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{item.triggerText}</AccordionTrigger>
          <AccordionContent>{item.contentText}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

NodeAccordion.craft = {
  displayName: 'Accordion',
  props: {
    type: 'single',
    collapsible: false,
    defaultValue: '',
    disabled: false,
    items: [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.' }],
  },
  related: {
    toolbar: AccordionSettings,
  },
};