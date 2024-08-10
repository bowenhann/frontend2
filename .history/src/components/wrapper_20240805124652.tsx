import React, { useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { MonitorPlay, Smartphone, Tablet, Code, Redo, Undo } from 'lucide-react';
import { getOutputCode } from '@/lib/code-gen';
import { CodeView } from '@/components/code-view';
import { DrawerTrigger, DrawerContent, Drawer } from '@/components/ui/drawer';

type WrapperProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const Wrapper = ({ children, style = {} }: WrapperProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const { query } = useEditor();
  const [wrapperWidth, setWrapperWidth] = useState('w-full');
  const [output, setOutput] = useState<string | null>();
  const [open, setOpen] = useState(false);

  const generateCode = () => {
    const nodes = query.getNodes();
    const { importString, output } = getOutputCode(nodes);
    setOutput(`${importString}\n\n${output}`);
  };

  const handleIconClick = (newWidth: string) => {
    setWrapperWidth(newWidth);
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
    </div>
  );
};

Wrapper.craft = {
  displayName: 'Wrapper',
  props: {
    className: 'w-full h-full',
  },
};