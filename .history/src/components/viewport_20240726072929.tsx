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

  const [generatedCode, setGeneratedCode] = useState<string>("");

  const handleComponentClick = useCallback(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      const { importString, output } = getOutputCode({
        [selectedNodeId]: selectedNode,
      });
      const fullCode = `${importString}\n\n${output}`;
      setGeneratedCode(fullCode);
      console.log('Selected component code:');
      console.log(fullCode);
    }
  }, [selected, query]);

  useEffect(() => {
    const viewportElement = document.querySelector('.viewport');
    if (viewportElement) {
      viewportElement.addEventListener('click', handleComponentClick);
      return () => {
        viewportElement.removeEventListener('click', handleComponentClick);
      };
    }
  }, [handleComponentClick]);

  return (
    <div className="viewport w-full overflow-y-auto overflow-x-hidden">
      <div className={"craftjs-renderer flex-1 h-full w-full"}>{children}</div>
      {generatedCode && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="fixed bottom-4 right-4">View Code</Button>
          </DrawerTrigger>
          <DrawerContent>
            <CodeView code={generatedCode} />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};