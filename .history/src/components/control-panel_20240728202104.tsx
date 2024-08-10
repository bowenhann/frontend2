import React, { useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";

export const ControlPanel = () => {
  const { selected, actions, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (selected.size > 0) {
      // We'll generate variants here
    } else {
      setVariants([]);
    }
  }, [selected, query]);

  return (
    <div className="w-80 border-l h-auto overflow-auto">
      <h3 className="py-2 px-4 border-b text-md font-semibold text-left">
        Control Panel
      </h3>
      {selected.size > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-semibold mt-4 mb-2">Variants:</h4>
          {/* We'll render variants here */}
        </div>
      )}
    </div>
  );
};