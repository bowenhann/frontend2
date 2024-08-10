import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

export const ResizablePanelLayout = ({ children }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <PanelGroup direction="horizontal" className="w-full h-full">
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          <Panel minSize={20}>
            {React.cloneElement(child, {
              className: `w-full h-full ${child.props.className || ''}`,
            })}
          </Panel>
          {index < childrenArray.length - 1 && <PanelResizeHandle />}
        </React.Fragment>
      ))}
    </PanelGroup>
  );
};

export const ResizablePanelSettings = () => {
  // Add any settings you want to expose for the ResizablePanelLayout
  return null;
};

ResizablePanelLayout.craft = {
  props: {},
  related: {
    toolbar: ResizablePanelSettings,
  },
};