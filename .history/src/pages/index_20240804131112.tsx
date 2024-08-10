import React, { useEffect, useRef, useState } from 'react'
import { Editor, Frame, Element, useEditor  } from '@craftjs/core'
import { ResizableComponent } from '@/components/resizableComponent'
import { ResizablePanelLayout } from '@/components/resizablePanelLayout'
import { BasicPanelLayout } from '@/components/BasicPanelLayout'
import { SideMenu } from '@/components/side-menu'
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
import { ReactIframe } from '@/components/react-iframe'
import { ControlPanel } from '@/components/control-panel'
import { Viewport } from '@/components/viewport'
import { RenderNode } from '@/components/render-node'
import { componentsMap } from '@/components/node/components-map'
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

import { renderComponents } from '@/lib/componentRenderer'

const DynamicContent = () => {
  const { id } = useNode();
  const { actions, query } = useEditor();

  useEffect(() => {
    console.log('DynamicContent useEffect triggered');
    const addComponents = () => {
      console.log('Adding components');
      try {
        const rootNodeId = query.node(id).get().data.linkedNodes.root;

        // Add ResizableComponent with header
        const headerNode = query.createNode(
          <Element id="header" is={ResizableComponent} width="95%" height="10%">
            <div className="bg-gray-800 text-white p-4">
              <h1 className="text-2xl font-bold">My Application</h1>
            </div>
          </Element>
        );
        actions.add(headerNode, rootNodeId);

        // Add ResizableComponent with NodeCalendar
        const calendarNode = query.createNode(
          <Element id="calendar" is={ResizableComponent} width="32%" height="50%">
            <NodeCalendar className="p-4" />
          </Element>
        );
        actions.add(calendarNode, rootNodeId);

        // Add ResizableComponent with NodeButton
        const buttonNode = query.createNode(
          <Element id="button1" is={ResizableComponent} width="20%" height="50%">
            <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
              Button 1
            </NodeButton>
          </Element>
        );
        actions.add(buttonNode, rootNodeId);

        // Add ResizableComponent with nested ResizableComponent and NodeButton
        const nestedButtonNode = query.createNode(
          <Element id="nested-buttons" is={ResizableComponent} width="20%" height="50%">
            <NodeButton>Button 2</NodeButton>
            <Element id="nested-button" is={ResizableComponent} width="10%" height="10%">
              <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
                Button 1
              </NodeButton>
            </Element>
          </Element>
        );
        actions.add(nestedButtonNode, rootNodeId);

        // Add ResizableComponent with another NodeButton
        const anotherButtonNode = query.createNode(
          <Element id="button3" is={ResizableComponent} width="20%" height="50%">
            <NodeButton>Button 3</NodeButton>
          </Element>
        );
        actions.add(anotherButtonNode, rootNodeId);

        // Add ResizableComponent with NodeCard
        const cardNode = query.createNode(
          <Element id="card" is={ResizableComponent} width="95%" height="35%">
            <NodeCard className="p-6 m-2">
              <NodeCardHeader>
                <NodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">
                  Card Title
                </NodeCardTitle>
                <NodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">
                  Card Description
                </NodeCardDescription>
              </NodeCardHeader>
              <NodeCardContent></NodeCardContent>
              <NodeCardFooter>
                <NodeButton>Footer button</NodeButton>
              </NodeCardFooter>
            </NodeCard>
          </Element>
        );
        actions.add(cardNode, rootNodeId);

        console.log('Components added successfully');
      } catch (error) {
        console.error('Error adding components:', error);
      }
    };

    addComponents();
  }, [id, actions, query]);

  return (
    <Element id="root" canvas>
      {/* This content will be replaced by the dynamic content */}
      Initial Content
    </Element>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
};

export default function Home() {
  return (
    <section className="w-full min-h-screen flex flex-col">
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
          NodeCalendar,
          ResizableComponent,
          Element,
          DynamicContent
        }}
        onRender={RenderNode}
      >
        <div className="flex flex-1 relative overflow-hidden">
          <SideMenu componentsMap={componentsMap} />
          <Viewport>
            <ReactIframe
              title="my frame"
              className="p-4 w-full h-full page-container"
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
                  <DynamicContent />
                </Element>
              </Frame>
            </ReactIframe>
          </Viewport>
          <ControlPanel />
        </div>
      </Editor>
    </section>
  )
}