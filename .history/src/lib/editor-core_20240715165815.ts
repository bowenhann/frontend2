// lib/editor-core.ts
import React, { createContext, useContext, useState, useCallback } from 'react';

type ComponentData = {
  type: string;
  props: any;
  children?: string[];
};

type EditorContextType = {
  components: Record<string, ComponentData>;
  selectedId: string | null;
  addComponent: (type: string, props: any, parentId?: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, newParentId: string, index: number) => void;
  undo: () => void;
  redo: () => void;
};

const defaultContext: EditorContextType = {
  components: {},
  selectedId: null,
  addComponent: () => {},
  updateComponent: () => {},
  removeComponent: () => {},
  selectComponent: () => {},
  moveComponent: () => {},
  undo: () => {},
  redo: () => {},
};

const EditorContext = createContext<EditorContextType>(defaultContext);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Record<string, ComponentData>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [past, setPast] = useState<Record<string, ComponentData>[]>([]);
  const [future, setFuture] = useState<Record<string, ComponentData>[]>([]);

  const pushToHistory = useCallback((newComponents: Record<string, ComponentData>) => {
    setPast(prev => [...prev, components]);
    setFuture([]);
    setComponents(newComponents);
  }, [components]);

  const addComponent = useCallback((type: string, props: any, parentId?: string) => {
    const id = Date.now().toString();
    const newComponent = { type, props, children: [] };
    const newComponents = { ...components, [id]: newComponent };
    if (parentId && newComponents[parentId]) {
      newComponents[parentId] = {
        ...newComponents[parentId],
        children: [...(newComponents[parentId].children || []), id]
      };
    }
    pushToHistory(newComponents);
  }, [components, pushToHistory]);

  const updateComponent = useCallback((id: string, updates: Partial<ComponentData>) => {
    const newComponents = {
      ...components,
      [id]: { ...components[id], ...updates }
    };
    pushToHistory(newComponents);
  }, [components, pushToHistory]);

  const removeComponent = useCallback((id: string) => {
    const newComponents = { ...components };
    delete newComponents[id];
    Object.values(newComponents).forEach(comp => {
      if (comp.children) {
        comp.children = comp.children.filter(childId => childId !== id);
      }
    });
    pushToHistory(newComponents);
  }, [components, pushToHistory]);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const moveComponent = useCallback((id: string, newParentId: string, index: number) => {
    const newComponents = { ...components };
    const oldParentId = Object.keys(newComponents).find(key => 
      newComponents[key].children && newComponents[key].children!.includes(id)
    );
    if (oldParentId) {
      newComponents[oldParentId].children = newComponents[oldParentId].children!.filter(childId => childId !== id);
    }
    if (!newComponents[newParentId].children) {
      newComponents[newParentId].children = [];
    }
    newComponents[newParentId].children!.splice(index, 0, id);
    pushToHistory(newComponents);
  }, [components, pushToHistory]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const newPast = past.slice(0, -1);
    const newPresent = past[past.length - 1];
    setFuture([components, ...future]);
    setPast(newPast);
    setComponents(newPresent);
  }, [components, past, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const [newPresent, ...newFuture] = future;
    setPast([...past, components]);
    setFuture(newFuture);
    setComponents(newPresent);
  }, [components, past, future]);

  const contextValue = {
    components,
    selectedId,
    addComponent,
    updateComponent,
    removeComponent,
    selectComponent,
    moveComponent,
    undo,
    redo,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);