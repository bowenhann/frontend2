import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Element, useNode } from '@craftjs/core';

const CraftPanel = ({ children, id, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Panel {...props}>
      <div ref={(ref) => connect(drag(ref))}>{children}</div>
    </Panel>
  );
};

export const BasicPanelLayout = () => {
  return (
    <Element is={PanelGroup} canvas direction="horizontal" id="root-panel-group">
      <Element is={CraftPanel} canvas id="left-panel">
        left
      </Element>
      <PanelResizeHandle />
      <Element is={CraftPanel} canvas id="middle-panel">
        <Element is={PanelGroup} canvas direction="vertical" id="middle-panel-group">
          <Element is={CraftPanel} canvas id="top-panel">
            top
          </Element>
          <PanelResizeHandle />
          <Element is={CraftPanel} canvas id="bottom-panel">
            <Element is={PanelGroup} canvas direction="horizontal" id="bottom-panel-group">
              <Element is={CraftPanel} canvas id="bottom-left-panel">
                left
              </Element>
              <PanelResizeHandle />
              <Element is={CraftPanel} canvas id="bottom-right-panel">
                right
              </Element>
            </Element>
          </Element>
        </Element>
      </Element>
      <PanelResizeHandle />
      <Element is={CraftPanel} canvas id="right-panel">
        right
      </Element>
    </Element>
  );
};

BasicPanelLayout.craft = {
  displayName: 'BasicPanelLayout',
};