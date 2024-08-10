import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Element, useNode } from '@craftjs/core';

const CraftPanel = ({ children, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Panel {...props}>
      <div ref={(ref) => connect(drag(ref))}>{children}</div>
    </Panel>
  );
};

export const BasicPanelLayout = () => {
  return (
    <Element is={PanelGroup} canvas direction="horizontal">
      <Element is={CraftPanel} canvas>
        left
      </Element>
      <PanelResizeHandle />
      <Element is={CraftPanel} canvas>
        <Element is={PanelGroup} canvas direction="vertical">
          <Element is={CraftPanel} canvas>
            top
          </Element>
          <PanelResizeHandle />
          <Element is={CraftPanel} canvas>
            <Element is={PanelGroup} canvas direction="horizontal">
              <Element is={CraftPanel} canvas>
                left
              </Element>
              <PanelResizeHandle />
              <Element is={CraftPanel} canvas>
                right
              </Element>
            </Element>
          </Element>
        </Element>
      </Element>
      <PanelResizeHandle />
      <Element is={CraftPanel} canvas>
        right
      </Element>
    </Element>
  );
};

BasicPanelLayout.craft = {
  displayName: 'BasicPanelLayout',
};