import React from 'react';
import { useNode } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

export const NodeAccordion = ({ 
  type = 'single',
  collapsible = false,
  defaultValue = '',
  disabled = false,
  className = '',
  items = [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
  ...props 
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Accordion 
      ref={(ref) => ref && connect(drag(ref))} 
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

NodeAccordion.craft = {
  displayName: 'Accordion',
  props: {
    type: 'single',
    collapsible: false,
    defaultValue: '',
    disabled: false,
    className: '',
    items: [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
  },
  related: {
    toolbar: SettingsControl,
  },
};