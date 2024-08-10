import React from 'react';
import { useNode } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

type AccordionType = 'single' | 'multiple';

interface AccordionProps {
  type?: AccordionType;
  collapsible?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  items?: Array<{ triggerText: string; contentText: string; className?: string }>;
}

const AccordionComponent = React.forwardRef<HTMLDivElement, AccordionProps>(({ 
  type = 'single',
  collapsible = false,
  defaultValue = '',
  disabled = false,
  className = '',
  items = [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
  ...props 
}, ref) => {
  return (
    <Accordion 
      ref={ref}
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
});

AccordionComponent.displayName = 'AccordionComponent';

export const NodeAccordion = () => {
  const { connectors: { connect, drag }, props } = useNode((node) => ({
    props: node.data.props as AccordionProps,
  }));

  return (
    <AccordionComponent
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      {...props}
    />
  );
};

NodeAccordion.craft = {
  props: {
    type: 'single' as AccordionType,
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