/* eslint-disable react/display-name */
// import React from 'react';
// import { useNode } from '@craftjs/core';
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
// import { SettingsControl } from '@/components/settings-control';
// import { cn } from '@/lib/utils';

// export const NodeAccordion = ({ 
//   type = 'single',
//   collapsible = false,
//   defaultValue = '',
//   disabled = false,
//   className = '',
//   items = [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
//   ...props 
// }) => {
//   const { connectors: { connect, drag } } = useNode();

//   return (
//     <Accordion 
//     ref={(ref) => connect(drag(ref)) as any}
//       type={type as any}
//       collapsible={type === 'single' ? collapsible : undefined}
//       defaultValue={defaultValue ? [defaultValue] : undefined}
//       disabled={disabled}
//       className={cn(className)}
//       {...props}
//     >
//       {items.map((item, index) => (
//         <AccordionItem key={index} value={`item-${index + 1}`} className={cn(item.className)}>
//           <AccordionTrigger>{item.triggerText}</AccordionTrigger>
//           <AccordionContent>{item.contentText}</AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   );
// };

// NodeAccordion.craft = {
//   displayName: 'Accordion',
//   props: {
//     type: 'single',
//     collapsible: false,
//     defaultValue: '',
//     disabled: false,
//     className: '',
//     items: [{ triggerText: 'Is it accessible?', contentText: 'Yes. It adheres to the WAI-ARIA design pattern.', className: '' }],
//   },
//   related: {
//     toolbar: SettingsControl,
//   },
// };


import React from 'react';
import { useNode, Element } from '@craftjs/core';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

export const NodeAccordion = ({ 
  type = 'single',
  collapsible = false,
  defaultValue = '',
  disabled = false,
  className = '',
  children,
  ...props 
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Accordion 
      ref={(ref) => connect(drag(ref)) as any}
      type={type as any}
      collapsible={type === 'single' ? collapsible : undefined}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      disabled={disabled}
      className={cn(className)}
      {...props}
    >
      {children}
    </Accordion>
  );
};

NodeAccordion.Item = ({ value, className = '', children }) => {
  return (
    <AccordionItem value={value} className={cn(className)}>
      {children}
    </AccordionItem>
  );
};

NodeAccordion.Trigger = ({ children }) => {
  return <AccordionTrigger>{children}</AccordionTrigger>;
};

NodeAccordion.Content = ({ children }) => {
  return <AccordionContent>{children}</AccordionContent>;
};

NodeAccordion.craft = {
  displayName: 'Accordion',
  props: {
    type: 'single',
    collapsible: false,
    defaultValue: '',
    disabled: false,
    className: '',
  },
  related: {
    toolbar: SettingsControl,
  },
};

export const NodeAccordionItem = ({ value, className = '', children }) => {
  return (
    <Element canvas is={NodeAccordion.Item} value={value} className={className}>
      {children}
    </Element>
  );
};

NodeAccordionItem.craft = {
  displayName: 'Accordion Item',
  props: {
    value: '',
    className: '',
  },
  related: {
    toolbar: SettingsControl,
  },
};

export const NodeAccordionTrigger = ({ children }) => {
  const { connectors: { connect } } = useNode();
  return (
    <NodeAccordion.Trigger >
      {children}
    </NodeAccordion.Trigger>
  );
};

NodeAccordionTrigger.craft = {
  displayName: 'Accordion Trigger',
  related: {
    toolbar: SettingsControl,
  },
};

export const NodeAccordionContent = ({ children }) => {
  const { connectors: { connect } } = useNode();
  return (
    <Element canvas is={NodeAccordion.Content} >
      {children}
    </Element>
  );
};

NodeAccordionContent.craft = {
  displayName: 'Accordion Content',
  related: {
    toolbar: SettingsControl,
  },
};