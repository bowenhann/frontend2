import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Element, useNode } from '@craftjs/core';

const CraftPanel = ({ children, id, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Element id={id} is={Panel} canvas {...props}>
      <div ref={(ref) => connect(drag(ref))}>{children}</div>
    </Element>
  );
};

export const BasicPanelLayout = () => {
  return (
    <Element id="root-panel-group" is={PanelGroup} canvas direction="horizontal">
      <CraftPanel id="left-panel">
        left
      </CraftPanel>
      <PanelResizeHandle />
      <CraftPanel id="middle-panel">
        <Element id="vertical-panel-group" is={PanelGroup} canvas direction="vertical">
          <CraftPanel id="top-panel">
            top
          </CraftPanel>
          <PanelResizeHandle />
          <CraftPanel id="bottom-panel">
            <Element id="inner-panel-group" is={PanelGroup} canvas direction="horizontal">
              <CraftPanel id="inner-left-panel">
                left
              </CraftPanel>
              <PanelResizeHandle />
              <CraftPanel id="inner-right-panel">
                right
              </CraftPanel>
            </Element>
          </CraftPanel>
        </Element>
      </CraftPanel>
      <PanelResizeHandle />
      <CraftPanel id="right-panel">
        right
      </CraftPanel>
    </Element>
  );
};

BasicPanelLayout.craft = {
  displayName: 'BasicPanelLayout',
};