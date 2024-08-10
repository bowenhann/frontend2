import React from "react";
import { NodeButton } from '@/components/node/button';

export const ControlPanel = () => {
  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      <div className="p-4">
        <h4 className="text-sm font-semibold mt-4 mb-2">Test Button:</h4>
        <NodeButton>Button 1</NodeButton>
      </div>
    </div>
  );
};