import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CodeView } from "@/components/code-view";
import { useEditor } from "@craftjs/core";
import { useState, useCallback, useEffect } from "react";
import { getOutputCode } from "@/lib/code-gen";

export const Viewport = ({ children }: { children: React.ReactNode }) => {
  const { selected, actions, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [code, setCode] = useState({ importString: '', output: '' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleComponentClick = useCallback(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const { importString, output } = getOutputCode({
        [selectedNodeId]: selectedNode,
      });
      setCode({ importString, output });
      setIsDrawerOpen(true);
    }
  }, [selected, query]);

  useEffect(() => {
    const viewport = document.querySelector('.viewport');
    if (viewport) {
      viewport.addEventListener('click', handleComponentClick);
      return () => {
        viewport.removeEventListener('click', handleComponentClick);
      };
    }
  }, [handleComponentClick]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <div className="viewport w-full overflow-y-auto overflow-x-hidden" onClick={handleComponentClick}>
        <div className={"craftjs-renderer flex-1 h-full w-full"}>{children}</div>
      </div>
      <DrawerContent>
        <CodeView importString={code.importString} output={code.output} />
      </DrawerContent>
    </Drawer>
  );
};