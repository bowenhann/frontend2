import React, { useEffect } from 'react';
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core';
import { ResizableComponent } from '@/components/resizableComponent';
import { NodeButton } from '@/components/node/button';
import { NodeCalendar } from '@/components/node/calendar';
import {
  NodeCard,
  NodeCardHeader,
  NodeCardTitle,
  NodeCardDescription,
  NodeCardContent,
  NodeCardFooter
} from '@/components/node/card';

const DynamicContent = () => {
  const { id } = useNode();
  const { actions, query } = useEditor();

  useEffect(() => {
    const addComponents = () => {
      console.log('Adding components');
      try {
        const linkedNodeId = query.node(id).get().data.linkedNodes.dynamic;

        actions.setProp(linkedNodeId, (props) => {
          props.children = [
            <ResizableComponent key="1" width="95%" height="10%">
              <div className="bg-gray-800 text-white p-4">
                <h1 className="text-2xl font-bold">My Application</h1>
              </div>
            </ResizableComponent>,
            <ResizableComponent key="2" width="32%" height="50%">
              <NodeCalendar className="p-4" />
            </ResizableComponent>,
            <ResizableComponent key="3" width="20%" height="50%">
              <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
                Button 1
              </NodeButton>
            </ResizableComponent>,
            <ResizableComponent key="4" width="20%" height="50%">
              <NodeButton>Button 2</NodeButton>
              <ResizableComponent width="10%" height="10%">
                <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
                  Button 1
                </NodeButton>
              </ResizableComponent>
            </ResizableComponent>,
            <ResizableComponent key="5" width="20%" height="50%">
              <NodeButton>Button 3</NodeButton>
            </ResizableComponent>,
            <ResizableComponent key="6" width="95%" height="35%">
              <NodeCard className="p-6 m-2">
                <NodeCardHeader>
                  <NodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">
                    Card Title
                  </NodeCardTitle>
                  <NodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">
                    Card Description
                  </NodeCardDescription>
                </NodeCardHeader>
                <NodeCardContent />
                <NodeCardFooter>
                  <NodeButton>Footer button</NodeButton>
                </NodeCardFooter>
              </NodeCard>
            </ResizableComponent>
          ];
        });
        console.log('Components added successfully');
      } catch (error) {
        console.error('Error adding components:', error);
      }
    };

    addComponents();
  }, [id, actions, query]);

  return (
    <Element id="dynamic" canvas>
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
          DynamicContent,
          ResizableComponent,
          NodeButton,
          NodeCalendar,
          NodeCard,
          NodeCardHeader,
          NodeCardTitle,
          NodeCardDescription,
          NodeCardContent,
          NodeCardFooter
        }}
      >
        <Frame>
          <Element is={DynamicContent} canvas />
        </Frame>
      </Editor>
    </section>
  );
}