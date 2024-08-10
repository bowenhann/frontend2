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


const buttonString = `
<ResizableComponent width="95%" height="10%">
  <div className="bg-gray-800 text-white p-4">
    <h1 className="text-2xl font-bold">My Application</h1>
  </div>
</ResizableComponent>
<ResizableComponent width="32%" height="50%">
  <NodeCalendar className="p-4"></NodeCalendar>
</ResizableComponent>
<!-- ... rest of your buttonString ... -->
`;

const StreamingRenderer = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const componentStrings = buttonString.split('</ResizableComponent>')
      .filter(Boolean)
      .map(str => str + '</ResizableComponent>');

    const simulateStreaming = async () => {
      for (let componentString of componentStrings) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay to simulate network latency
        setComponents(prevComponents => [
          ...prevComponents,
          ...renderComponents(componentString)
        ]);
      }
    };

    simulateStreaming();
  }, []);

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

export default StreamingRenderer;