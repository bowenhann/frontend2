import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

export const BasicPanelLayout = () => {
  return (
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
  );
};