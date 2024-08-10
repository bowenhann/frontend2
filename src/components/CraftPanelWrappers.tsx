import React from 'react';
import { useNode } from '@craftjs/core';
import { PanelGroup as OriginalPanelGroup, Panel as OriginalPanel, PanelResizeHandle as OriginalPanelResizeHandle } from 'react-resizable-panels';

export const CraftPanelGroup = ({ children, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref))}>
      <OriginalPanelGroup {...props}>{children}</OriginalPanelGroup>
    </div>
  );
};

CraftPanelGroup.craft = {
  displayName: 'PanelGroup',
  props: {},
  rules: {
    canDrag: () => true,
  },
};

export const CraftPanel = ({ children, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref))}>
      <OriginalPanel {...props}>{children}</OriginalPanel>
    </div>
  );
};

CraftPanel.craft = {
  displayName: 'Panel',
  props: {},
  rules: {
    canDrag: () => true,
  },
};

export const CraftPanelResizeHandle = (props) => {
  const { connectors: { connect } } = useNode();
  return <OriginalPanelResizeHandle ref={connect} {...props} />;
};

CraftPanelResizeHandle.craft = {
  displayName: 'PanelResizeHandle',
  props: {},
  rules: {
    canDrag: () => false,
  },
};