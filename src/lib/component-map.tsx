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
import { NodeAccordion } from '@/components/node/accordion';
import { NodeAvatar } from '@/components/node/avatar';
import { NodeAlertDialog } from '@/components/node/alert-dialog';
import { NodeAlert } from '@/components/node/alert';
import { DynamicContent } from '@/components/dynamicContent';

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
  NodeAvatar,
  NodeAlertDialog,
  NodeAlert,
  DynamicContent,
};
