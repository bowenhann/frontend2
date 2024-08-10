export const Viewport = ({ children }: { children: React.ReactNode }) => {
  const { selected, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  const [code, setCode] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleComponentClick = useCallback(() => {
    if (selected.size > 0) {
      const selectedNodeId = Array.from(selected)[0];
      const selectedNode = query.node(selectedNodeId).get();
      
      // 检查是否点击的是根节点
      if (selectedNodeId === 'ROOT' || selectedNode.data.name === 'Canvas') {
        // 如果是根节点，不显示代码
        setIsDrawerOpen(false);
        return;
      }

      const generatedCode = generateComponentCode(selectedNode, query);
      setCode(generatedCode);
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
        <pre className="p-4 bg-gray-100 rounded overflow-auto">
          <code>{code}</code>
        </pre>
      </DrawerContent>
    </Drawer>
  );
};