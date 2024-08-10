// lib/editor-core.ts
import React, { createContext, useContext, useState, useCallback } from 'react';

type ComponentData = {
  type: string;
  props: any;
  children?: string[];
};

type EditorState = {
  components: Record<string, ComponentData>;
  selectedId: string | null;
  history: {
    past: Record<string, ComponentData>[];
    future: Record<string, ComponentData>[];
  };
};

type EditorActions = {
  addComponent: (type: string, props: any, parentId?: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, newParentId: string, index: number) => void;
  undo: () => void;
  redo: () => void;
};

type EditorContextType = {
  state: EditorState;
  actions: EditorActions;
};

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EditorState>({
    components: {},
    selectedId: null,
    history: { past: [], future: [] }
  });

  const actions: EditorActions = {
    addComponent: useCallback((type: string, props: any, parentId?: string) => {
      const id = Date.now().toString();
      const newComponent = { type, props, children: [] };
      setState(prev => {
        const newState = { ...prev.components, [id]: newComponent };
        if (parentId && newState[parentId]) {
          newState[parentId] = {
            ...newState[parentId],
            children: [...(newState[parentId].children || []), id]
          };
        }
        return {
          ...prev,
          components: newState,
          history: {
            past: [...prev.history.past, prev.components],
            future: []
          }
        };
      });
    }, []),

    updateComponent: useCallback((id: string, updates: Partial<ComponentData>) => {
      setState(prev => {
        const newState = {
          ...prev.components,
          [id]: { ...prev.components[id], ...updates }
        };
        return {
          ...prev,
          components: newState,
          history: {
            past: [...prev.history.past, prev.components],
            future: []
          }
        };
      });
    }, []),

    removeComponent: useCallback((id: string) => {
      setState(prev => {
        const newState = { ...prev.components };
        delete newState[id];
        Object.values(newState).forEach(comp => {
          if (comp.children) {
            comp.children = comp.children.filter(childId => childId !== id);
          }
        });
        return {
          ...prev,
          components: newState,
          history: {
            past: [...prev.history.past, prev.components],
            future: []
          }
        };
      });
    }, []),

    selectComponent: useCallback((id: string | null) => {
      setState(prev => ({ ...prev, selectedId: id }));
    }, []),

    moveComponent: useCallback((id: string, newParentId: string, index: number) => {
      setState(prev => {
        const newState = { ...prev.components };
        const oldParentId = Object.keys(newState).find(key => 
          newState[key].children && newState[key].children!.includes(id)
        );
        if (oldParentId) {
          newState[oldParentId].children = newState[oldParentId].children!.filter(childId => childId !== id);
        }
        if (!newState[newParentId].children) {
          newState[newParentId].children = [];
        }
        newState[newParentId].children!.splice(index, 0, id);
        return {
          ...prev,
          components: newState,
          history: {
            past: [...prev.history.past, prev.components],
            future: []
          }
        };
      });
    }, []),

    undo: useCallback(() => {
      setState(prev => {
        if (prev.history.past.length === 0) return prev;
        const newPast = prev.history.past.slice(0, -1);
        const newPresent = prev.history.past[prev.history.past.length - 1];
        return {
          ...prev,
          components: newPresent,
          history: {
            past: newPast,
            future: [prev.components, ...prev.history.future]
          }
        };
      });
    }, []),

    redo: useCallback(() => {
      setState(prev => {
        if (prev.history.future.length === 0) return prev;
        const [newPresent, ...newFuture] = prev.history.future;
        return {
          ...prev,
          components: newPresent,
          history: {
            past: [...prev.history.past, prev.components],
            future: newFuture
          }
        };
      });
    }, []),
  };

  return (
    <EditorContext.Provider value={{ state, actions }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};