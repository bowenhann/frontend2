import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

type ComponentData = {
  type: string;
  props: any;
  children?: ComponentData[];
};

type EditorContextType = {
  components: Record<string, ComponentData>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateComponent: (id: string, newData: Partial<ComponentData>) => void;
  addComponent: (parentId: string | null, component: ComponentData) => void;
  removeComponent: (id: string) => void;
  moveComponent: (id: string, newParentId: string | null, index: number) => void;
};

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Record<string, ComponentData>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateComponent = (id: string, newData: Partial<ComponentData>) => {
    setComponents(prev => ({
      ...prev,
      [id]: { ...prev[id], ...newData }
    }));
  };

  const addComponent = (parentId: string | null, component: ComponentData) => {
    const newId = Date.now().toString();
    setComponents(prev => ({
      ...prev,
      [newId]: component,
      ...(parentId ? {
        [parentId]: {
          ...prev[parentId],
          children: [...(prev[parentId].children || []), newId]
        }
      } : {})
    }));
  };

  const removeComponent = (id: string) => {
    setComponents(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const moveComponent = (id: string, newParentId: string | null, index: number) => {
    setComponents(prev => {
      const updatedComponents = { ...prev };
      const componentToMove = updatedComponents[id];
      
      // Remove from old parent
      Object.values(updatedComponents).forEach(comp => {
        if (comp.children) {
          comp.children = comp.children.filter(childId => childId !== id);
        }
      });

      // Add to new parent
      if (newParentId) {
        if (!updatedComponents[newParentId].children) {
          updatedComponents[newParentId].children = [];
        }
        updatedComponents[newParentId].children.splice(index, 0, id);
      }

      return updatedComponents;
    });
  };

  return (
    <EditorContext.Provider value={{
      components,
      selectedId,
      setSelectedId,
      updateComponent,
      addComponent,
      removeComponent,
      moveComponent
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const useNode = (id: string) => {
  const { components, selectedId, setSelectedId, updateComponent } = useEditor();
  const nodeRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return {
    id,
    ref: nodeRef,
    data: components[id],
    isSelected: selectedId === id,
    isHovered,
    select: () => setSelectedId(id),
    updateProps: (newProps: any) => updateComponent(id, { props: { ...components[id].props, ...newProps } })
  };
};
