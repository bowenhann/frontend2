import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { renderComponents } from '@/lib/componentRenderer';

import { ResizableComponent } from '@/components/resizableComponent'
import { ResizablePanelLayout } from '@/components/resizablePanelLayout'

import { Canvas } from '@/components/canvas'
import { NodeButton } from '@/components/node/button'
import {
	NodeCardHeader,
	NodeCard,
	NodeCardContent,
	NodeCardDescription,
	NodeCardTitle,
	NodeCardFooter
} from '@/components/node/card'
import { NodeAlertDialog } from '@/components/node/alert-dialog'
import { NodeCalendar } from '@/components/node/calendar'
import { RenderNode } from '@/components/render-node'
import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
import { NodeAccordion } from '@/components/node/accordion'
import { NodeAvatar } from '@/components/node/avatar'
import { NodeAlert } from '@/components/node/alert'
import { NodeAspectRatio } from '@/components/node/aspect-ratio'
import { NodeBadge } from '@/components/node/badge'
import { NodeCheckbox } from '@/components/node/checkbox'
import { NodeCollapsible } from '@/components/node/collapsible'
import { NodeCommand } from '@/components/node/command'
import { NodeContextMenu } from '@/components/node/context-menu'
import { NodeDialog } from '@/components/node/dialog'

export const StreamingRenderer = ({ streamingString }) => {
  const [components, setComponents] = useState([]);
  const [buffer, setBuffer] = useState('');

  useEffect(() => {
    const processBuffer = () => {
      const closingTagIndex = buffer.indexOf('</ResizableComponent>');
      if (closingTagIndex !== -1) {
        const completeComponent = buffer.slice(0, closingTagIndex + '</ResizableComponent>'.length);
        
        const newComponents = renderComponents(completeComponent);
        console.log('New components:', newComponents); // Add this line

        setComponents(prevComponents => [...prevComponents, ...newComponents]);
        setBuffer(buffer.slice(closingTagIndex + '</ResizableComponent>'.length));
      }
    };

    setBuffer(prevBuffer => prevBuffer + streamingString);
    processBuffer();
  }, [streamingString]);

  return (
    <Editor
      resolver={{
        NodeButton,
        Canvas,
        NodeCardHeader,
        NodeCard,
        NodeCardContent,
        NodeCardDescription,
        NodeCardTitle,
        NodeCardFooter,
        NodeOneBlock,
        NodeTwoBlocks,
        NodeCalendar,
        ResizableComponent,
        ResizablePanelLayout,
        Element,
        div: 'div',
        span: 'span',
        NodeAccordion,
        NodeAvatar,
        NodeAlertDialog,
        NodeAlert,
        NodeAspectRatio,
        NodeBadge,
        NodeCheckbox,
        NodeCollapsible,
        NodeCommand,
        NodeContextMenu,
        NodeDialog
      }}
      onRender={RenderNode}
    >
      <Frame>
        <Element
          is={Canvas}
          id="ROOT"
          canvas
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}
        >
          {components}
        </Element>
      </Frame>
    </Editor>
  );
};

// export default StreamingRenderer;