import React from 'react';
import { useNode } from '@craftjs/core';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { AspectRatioSettings } from '@/components/settings/aspect-ratio';

export const NodeAspectRatio = ({
  ratio = 16 / 9,
  children,
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <AspectRatio
      ref={(ref) => connect(drag(ref)) as any}
      ratio={ratio}
      {...props}
    >
      {children}
    </AspectRatio>
  );
};

NodeAspectRatio.craft = {
  displayName: 'Aspect Ratio',
  props: {
    ratio: 16 / 9,
  },
  related: {
    toolbar: AspectRatioSettings,
  },
};