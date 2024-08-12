import React from 'react';
import { Element } from '@craftjs/core';
import { ResizableComponent } from '@/components/resizableComponent';
import { NodeButton } from '@/components/node/button';
import {
  NodeCardHeader,
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardTitle,
  NodeCardFooter
} from '@/components/node/card';
import { NodeCalendar } from '@/components/node/calendar';
import { NodeAccordion, NodeAccordionTrigger,
  NodeAccordionItem,
  NodeAccordionContent, } from '@/components/node/accordion';
import { NodeAvatar } from '@/components/node/avatar';
import { NodeAlertDialog } from '@/components/node/alert-dialog';
import { NodeAlert } from '@/components/node/alert';
import { NodeAspectRatio } from '@/components/node/aspect-ratio';
import { DynamicContent } from '@/components/dynamicContent';
import { NodeBadge } from '@/components/node/badge';
import { NodeCollapsible } from '@/components/node/collapsible';
import { NodeCheckbox } from '@/components/node/checkbox';
import { NodeContextMenu } from '@/components/node/context-menu';
import { NodeCommand } from '@/components/node/command';
import { NodeDialog } from '@/components/node/dialog';
import { NodeInput } from '@/components/node/input';
import { NodeHoverCard } from '@/components/node/hover-card';
import { HoverCard } from '@radix-ui/react-hover-card';


export const componentMap = {
  Element,
  NodeButton,
  NodeCard,
  NodeCardHeader,
  NodeCardTitle,
  NodeCardDescription,
  NodeCardContent,
  NodeCardFooter,
  NodeCalendar,
  div: 'div',
  span: 'span',
  ResizableComponent,
  NodeAccordion,
  NodeAccordionTrigger,
          NodeAccordionItem,
          NodeAccordionContent,
          NodeAspectRatio,
  NodeAvatar,
  NodeAlertDialog,
  NodeAlert,
  NodeBadge,
  NodeCollapsible,
  NodeCheckbox,
  NodeContextMenu,
  NodeCommand,
  NodeDialog,
  NodeInput,
  NodeHoverCard,
  DynamicContent,
};


export const componentNameMap = {
  Button: 'NodeButton',
  Card: 'NodeCard',
  CardHeader: 'NodeCardHeader',
  CardContent: 'NodeCardContent',
  CardFooter: 'NodeCardFooter',
  CardTitle: 'NodeCardTitle',
  CardDescription: 'NodeCardDescription',
  Badge: 'NodeBadge',
  Accordion: 'NodeAccordion',
  AccordionTrigger: 'NodeAccordionTrigger',
  AccordionItem: 'NodeAccordionItem',
  AccordionContent: 'NodeAccordionContent',
  AspectRatio: 'NodeAspectRatio',
  Avatar: 'NodeAvatar',
  AlertDialog: 'NodeAlertDialog',
  Alert: 'NodeAlert',
  Checkbox: 'NodeCheckbox',
  Collapsible: 'NodeCollapsible',
  Command: 'NodeCommand',
  ContextMenu: 'NodeContextMenu',
  Dialog: 'NodeDialog',
  HoverCard: 'NodeHoverCard',
  // Add mappings for other components as needed
};
