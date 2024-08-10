import React, { useEffect } from 'react'
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core'
import { ResizableComponent } from '@/components/resizableComponent'
import { NodeButton } from '@/components/node/button'
import { NodeCalendar } from '@/components/node/calendar'
import {
  NodeCard,
  NodeCardHeader,
  NodeCardTitle,
  NodeCardDescription,
  NodeCardContent,
  NodeCardFooter
} from '@/components/node/card'
import { SideMenu } from '@/components/side-menu'
import { Canvas } from '@/components/canvas'
import { ReactIframe } from '@/components/react-iframe'
import { ControlPanel } from '@/components/control-panel'
import { Viewport } from '@/components/viewport'
import { RenderNode } from '@/components/render-node'
import { componentsMap } from '@/components/node/components-map'

const buttonString = `
<ResizableComponent width="95%" height="10%">
  <div className="bg-gray-800 text-white p-4">
    <h1 className="text-2xl font-bold">My Application</h1>
  </div>
</ResizableComponent>
<ResizableComponent width="32%" height="50%">
  <NodeCalendar className="p-4"></NodeCalendar>
</ResizableComponent>
<ResizableComponent width="20%" height="50%">
  <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
    Button 1
  </NodeButton>
</ResizableComponent>
<ResizableComponent width="20%" height="50%">
  <NodeButton>Button 2</NodeButton>
  <ResizableComponent width="10%" height="10%">
    <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
      Button 1
    </NodeButton>
  </ResizableComponent>
</ResizableComponent>
<ResizableComponent width="20%" height="50%">
  <NodeButton>Button 3</NodeButton>
</ResizableComponent>
<ResizableComponent width="95%" height="35%">
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
</ResizableComponent>
`

const DynamicContent = () => {
  const { id } = useNode();
  const { actions, query } = useEditor();

  useEffect(() => {
    console.log('DynamicContent useEffect triggered');
    const addComponents = () => {
      console.log('Adding components');
      try {
        const linkedNodeId = query.node(id).get().data.linkedNodes.dynamic;
        actions.setProp(linkedNodeId, (props) => {
          // Parse buttonString and create components
          const components = buttonString.split('</ResizableComponent>')
            .filter(str => str.trim())
            .map((componentString, index) => {
              return React.createElement(ResizableComponent, {
                key: index,
                dangerouslySetInnerHTML: { __html: componentString + '</ResizableComponent>' }
              });
            });
          props.children = components;
        });
        console.log('Components added successfully');
      } catch (error) {
        console.error('Error adding components:', error);
      }
    };

    addComponents();
  }, [id, actions, query]);

  return (
    <Element id="dynamic" is={React.Fragment} canvas>
      {/* This content will be replaced by the dynamic content */}
      Loading...
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
          DynamicContent,
          Element,
          div: 'div',
          span: 'span',
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
                  id="ROOT"
                  canvas
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start'
                  }}
                >
                  <Element is={DynamicContent} canvas />
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