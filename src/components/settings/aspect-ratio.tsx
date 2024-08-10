import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AspectRatioSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ratio">Ratio</Label>
        <Input
          id="ratio"
          type="number"
          step="0.1"
          value={props.ratio || 16 / 9}
          onChange={(e) => setProp((props: any) => (props.ratio = parseFloat(e.target.value)))}
        />
      </div>
    </div>
  );
};