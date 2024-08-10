import React from 'react';
import { useNode } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { withNode } from '@/components/node/connector';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

const AccordionComponent = ({ 
  type = 'single',
  collapsible = false,
  defaultValue = '',
  disabled = false,
  className = '',
  items = [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
  ...props 
}) => {
  return (
    <Accordion 
      type={type}
      collapsible={type === 'single' ? collapsible : undefined}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      disabled={disabled}
      className={cn(className)}
      {...props}
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`} className={cn(item.className)}>
          <AccordionTrigger>{item.triggerText}</AccordionTrigger>
          <AccordionContent>{item.contentText}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export const NodeAccordion = withNode(AccordionComponent, {
  draggable: true,
});

(NodeAccordion as any).craft = {
  ...((NodeAccordion as any).craft || {}),
  related: {
    toolbar: SettingsControl,
  },
  props: {
    type: 'single',
    collapsible: false,
    defaultValue: '',
    disabled: false,
    className: '',
    items: [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
  },
  custom: {
    displayName: 'Accordion',
  },
};