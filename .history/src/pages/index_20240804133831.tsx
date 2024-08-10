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

// 用于调试的包装函数
const withCraftComponent = (Component, displayName) => {
  const WrappedComponent = (props) => {
    console.log(`Rendering ${displayName}`, props);
    return <Component {...props} />;
  };
  WrappedComponent.craft = {
    displayName,
  };
  return WrappedComponent;
};

const WrappedResizableComponent = withCraftComponent(ResizableComponent, 'ResizableComponent');
const WrappedNodeButton = withCraftComponent(NodeButton, 'NodeButton');
const WrappedNodeCalendar = withCraftComponent(NodeCalendar, 'NodeCalendar');
const WrappedNodeCard = withCraftComponent(NodeCard, 'NodeCard');
const WrappedNodeCardHeader = withCraftComponent(NodeCardHeader, 'NodeCardHeader');
const WrappedNodeCardTitle = withCraftComponent(NodeCardTitle, 'NodeCardTitle');
const WrappedNodeCardDescription = withCraftComponent(NodeCardDescription, 'NodeCardDescription');
const WrappedNodeCardContent = withCraftComponent(NodeCardContent, 'NodeCardContent');
const WrappedNodeCardFooter = withCraftComponent(NodeCardFooter, 'NodeCardFooter');

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
            <WrappedResizableComponent key="1" width="95%" height="10%">
              <div className="bg-gray-800 text-white p-4">
                <h1 className="text-2xl font-bold">My Application</h1>
              </div>
            </WrappedResizableComponent>,
            <WrappedResizableComponent key="2" width="32%" height="50%">
              <WrappedNodeCalendar className="p-4" />
            </WrappedResizableComponent>,
            <WrappedResizableComponent key="3" width="20%" height="50%">
              <WrappedNodeButton className="bg-red-500 text-white px-4 py-2 rounded">
                Button 1
              </WrappedNodeButton>
            </WrappedResizableComponent>,
            <WrappedResizableComponent key="4" width="20%" height="50%">
              <WrappedNodeButton>Button 2</WrappedNodeButton>
              <WrappedResizableComponent width="10%" height="10%">
                <WrappedNodeButton className="bg-red-500 text-white px-4 py-2 rounded">
                  Button 1
                </WrappedNodeButton>
              </WrappedResizableComponent>
            </WrappedResizableComponent>,
            <WrappedResizableComponent key="5" width="20%" height="50%">
              <WrappedNodeButton>Button 3</WrappedNodeButton>
            </WrappedResizableComponent>,
            <WrappedResizableComponent key="6" width="95%" height="35%">
              <WrappedNodeCard className="p-6 m-2">
                <WrappedNodeCardHeader>
                  <WrappedNodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">
                    Card Title
                  </WrappedNodeCardTitle>
                  <WrappedNodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">
                    Card Description
                  </WrappedNodeCardDescription>
                </WrappedNodeCardHeader>
                <WrappedNodeCardContent />
                <WrappedNodeCardFooter>
                  <WrappedNodeButton>Footer button</WrappedNodeButton>
                </WrappedNodeCardFooter>
              </WrappedNodeCard>
            </WrappedResizableComponent>
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
          ResizableComponent: WrappedResizableComponent,
          NodeButton: WrappedNodeButton,
          NodeCalendar: WrappedNodeCalendar,
          NodeCard: WrappedNodeCard,
          NodeCardHeader: WrappedNodeCardHeader,
          NodeCardTitle: WrappedNodeCardTitle,
          NodeCardDescription: WrappedNodeCardDescription,
          NodeCardContent: WrappedNodeCardContent,
          NodeCardFooter: WrappedNodeCardFooter
        }}
        onRender={({ render }) => {
          console.log('Rendering:', render);
          return render;
        }}
      >
        <Frame>
          <Element is={DynamicContent} canvas />
        </Frame>
      </Editor>
    </section>
  );
}