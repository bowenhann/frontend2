import React from 'react';
import { withNode } from '@/components/node/connector';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';
import { useNode } from '@craftjs/core';

// 定义 AccordionProps 类型
type AccordionProps = {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  items?: Array<{ triggerText: string; contentText: string; className?: string }>;
};

const AccordionComponent: React.FC<AccordionProps> = ({ 
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
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
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

const draggable = true;

export const NodeAccordion = withNode(AccordionComponent, {
  draggable,
});

(NodeAccordion as any).craft = {
  ...((NodeAccordion as any).craft || {}),
  related: {
    toolbar: SettingsControl,
  },
  props: {
    type: 'single' as const,
    collapsible: false,
    defaultValue: '',
    disabled: false,
    className: '',
    items: [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
  },
};