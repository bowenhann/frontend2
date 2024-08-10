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


import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { renderComponents } from '@/lib/componentRenderer';

const StreamingComponentRenderer = ({ streamSource }) => {
  const [components, setComponents] = useState([]);
  const [buffer, setBuffer] = useState('');

  useEffect(() => {
    const reader = streamSource.getReader();
    const decoder = new TextDecoder();

    const processText = (text) => {
      const updatedBuffer = buffer + text;
      const completeComponents = updatedBuffer.split('</ResizableComponent>');
      
      if (completeComponents.length > 1) {
        const newComponents = completeComponents.slice(0, -1).map(comp => comp + '</ResizableComponent>');
        setComponents(prevComponents => [...prevComponents, ...renderComponents(newComponents.join(''))]);
        setBuffer(completeComponents[completeComponents.length - 1]);
      } else {
        setBuffer(updatedBuffer);
      }
    };

    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          processText(decoder.decode(value, { stream: true }));
        }
      } finally {
        reader.releaseLock();
      }
    };

    readStream();

    return () => {
      reader.cancel();
    };
  }, [streamSource]);

  return (
    <Editor
      resolver={{
        // Include your component resolvers here
        ResizableComponent: ResizableComponent,
        NodeButton: NodeButton,
        // ... other components
      }}
    >
      <Frame>
        <Element
          is={Canvas}
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

export default StreamingComponentRenderer;