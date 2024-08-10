import React, { useState, useEffect } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { MonitorPlay, Smartphone, Tablet, Code, Redo, Undo, Save, Upload } from 'lucide-react';
import { getOutputCode } from '@/lib/code-gen';
import { CodeView } from '@/components/code-view';
import { DrawerTrigger, DrawerContent, Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type WrapperProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const Wrapper = ({ children, style = {} }: WrapperProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const { query, actions, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));
  const [wrapperWidth, setWrapperWidth] = useState('w-full');
  const [output, setOutput] = useState<string | null>();
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [savedLayouts, setSavedLayouts] = useState<string[]>([]);

  useEffect(() => {
    const layouts = Object.keys(localStorage).filter(key => key.startsWith('craftjs_layout_'));
    setSavedLayouts(layouts.map(key => key.replace('craftjs_layout_', '')));
  }, []);

  const generateCode = () => {
    const nodes = query.getNodes();
    const { importString, output } = getOutputCode(nodes);
    setOutput(`${importString}\n\n${output}`);
  };

  const handleIconClick = (newWidth: string) => {
    setWrapperWidth(newWidth);
  };

  const handleSave = () => {
    if (layoutName) {
      const json = query.serialize();
      localStorage.setItem(`craftjs_layout_${layoutName}`, JSON.stringify(json));
      setSavedLayouts([...savedLayouts, layoutName]);
      setLayoutName('');
      setSaveOpen(false);
    }
  };

  const handleLoad = (name: string) => {
    const json = localStorage.getItem(`craftjs_layout_${name}`);
    if (json) {
      actions.deserialize(JSON.parse(json));
      setLoadOpen(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center" style={style}>
      <div className={`${wrapperWidth} flex flex-col h-full border rounded-sm`}>
        <div className="flex justify-between items-center p-4 w-full bg-gray-200">
          <div className="flex gap-2">
            <MonitorPlay
              size={24}
              strokeWidth={1.75}
              className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer"
              onClick={() => handleIconClick('w-full')}
            />
            <Tablet
              size={24}
              strokeWidth={1.75}
              className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer"
              onClick={() => handleIconClick('w-[768px]')}
            />
            <Smartphone
              size={24}
              strokeWidth={1.75}
              className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer"
              onClick={() => handleIconClick('w-[375px]')}
            />
          </div>
          <div className="flex gap-2">
            <Undo
              size={24}
              strokeWidth={1.75}
              className={`transition duration-300 cursor-pointer ${
                canUndo ? 'text-primary hover:text-primary-dark' : 'text-gray-300'
              }`}
              onClick={() => canUndo && actions.history.undo()}
            />
            <Redo
              size={24}
              strokeWidth={1.75}
              className={`transition duration-300 cursor-pointer ${
                canRedo ? 'text-primary hover:text-primary-dark' : 'text-gray-300'
              }`}
              onClick={() => canRedo && actions.history.redo()}
            />
            <Save
              size={24}
              strokeWidth={1.75}
              className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer"
              onClick={() => setSaveOpen(true)}
            />
            <Upload
              size={24}
              strokeWidth={1.75}
              className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer"
              onClick={() => setLoadOpen(true)}
            />
            <Drawer
              open={open}
              onOpenChange={(value: boolean) => {
                generateCode();
                setOpen(value);
              }}
            >
              <DrawerTrigger>
                <Code
                  size={24}
                  strokeWidth={1.75}
                  className="text-gray-500 hover:text-primary transition duration-300 cursor-pointer"
                />
              </DrawerTrigger>
              <DrawerContent className="h-[75vh]">
                <CodeView codeString={output as string} />
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <div
          className={`${wrapperWidth} flex-1 bg-white rounded-b-lg mx-auto transition-all duration-300`}
          ref={(ref) => {
            if (ref) {
              connect(drag(ref));
            }
          }}
        >
          {children}
        </div>
      </div>

      <Drawer open={saveOpen} onOpenChange={setSaveOpen}>
        <DrawerContent>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Save Layout</h2>
            <Input
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Enter layout name"
              className="mb-4"
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={loadOpen} onOpenChange={setLoadOpen}>
        <DrawerContent>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Load Layout</h2>
            {savedLayouts.map((name) => (
              <Button key={name} onClick={() => handleLoad(name)} className="block w-full mb-2">
                {name}
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

Wrapper.craft = {
  displayName: 'Wrapper',
  props: {
    className: 'w-full h-full',
  },
};