import React from 'react';
import { useNode } from '@craftjs/core';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

export const BasicPanelLayout = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))}>
      <PanelGroup direction="horizontal">
        <Panel>
          left
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              top
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <PanelGroup direction="horizontal">
                <Panel>
                  left
                </Panel>
                <PanelResizeHandle />
                <Panel>
                  right
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          right
        </Panel>
      </PanelGroup>
    </div>
  );
};

BasicPanelLayout.craft = {
  displayName: 'BasicPanelLayout',
  props: {},
  rules: {
    canDrag: () => true,
  },
};