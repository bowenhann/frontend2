import React from "react";

export const ControlPanel = () => {
  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      <div className="p-4">
        <h4 className="text-sm font-semibold mt-4 mb-2">Test Button:</h4>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Button 1
        </button>
      </div>
    </div>
  );
};