import React from 'react';
import { useNode } from '@craftjs/core';
import { CraftPanelGroup, CraftPanel, CraftPanelResizeHandle } from './CraftPanelWrappers';

export const BasicPanelLayout = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))}>
      <CraftPanelGroup direction="horizontal">
        <CraftPanel>
          left
        </CraftPanel>
        <CraftPanelResizeHandle />
        <CraftPanel>
          <CraftPanelGroup direction="vertical">
            <CraftPanel>
              top
            </CraftPanel>
            <CraftPanelResizeHandle />
            <CraftPanel>
              <CraftPanelGroup direction="horizontal">
                <CraftPanel>
                  left
                </CraftPanel>
                <CraftPanelResizeHandle />
                <CraftPanel>
                  right
                </CraftPanel>
              </CraftPanelGroup>
            </CraftPanel>
          </CraftPanelGroup>
        </CraftPanel>
        <CraftPanelResizeHandle />
        <CraftPanel>
          right
        </CraftPanel>
      </CraftPanelGroup>
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