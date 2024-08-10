// lib/editor-core.ts
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

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

type EditorContextType = EditorState & {
  actions: {
    addComponent: (type: string, props: any, parentId?: string) => void;
    updateComponent: (id: string, updates: Partial<ComponentData>) => void;
    removeComponent: (id: string) => void;
    selectComponent: (id: string | null) => void;
    moveComponent: (id: string, newParentId: string, index: number) => void;
    undo: () => void;
    redo: () => void;
  };
};

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EditorState>({
    components: {},
    selectedId: null,
    history: { past: [], future: [] }
  });

  const pushToHistory = (newState: Record<string, ComponentData>) => {
    setState(prev => ({
      ...prev,
      components: newState,
      history: {
        past: [...prev.history.past, prev.components],
        future: []
      }
    }));
  };

  const actions = {
    addComponent: (type: string, props: any, parentId?: string) => {
      const id = Date.now().toString();
      const newComponent = { type, props, children: [] };
      const newState = { ...state.components, [id]: newComponent };
      if (parentId) {
        newState[parentId].children = [...(newState[parentId].children || []), id];
      }
      pushToHistory(newState);
    },
    updateComponent: (id: string, updates: Partial<ComponentData>) => {
      const newState = {
        ...state.components,
        [id]: { ...state.components[id], ...updates }
      };
      pushToHistory(newState);
    },
    removeComponent: (id: string) => {
      const newState = { ...state.components };
      delete newState[id];
      Object.values(newState).forEach(comp => {
        if (comp.children) {
          comp.children = comp.children.filter(childId => childId !== id);
        }
      });
      pushToHistory(newState);
    },
    selectComponent: (id: string | null) => {
      setState(prev => ({ ...prev, selectedId: id }));
    },
    moveComponent: (id: string, newParentId: string, index: number) => {
      const newState = { ...state.components };
      const oldParentId = Object.keys(newState).find(key => 
        newState[key].children && newState[key].children.includes(id)
      );
      if (oldParentId) {
        newState[oldParentId].children = newState[oldParentId].children.filter(childId => childId !== id);
      }
      newState[newParentId].children = [
        ...newState[newParentId].children.slice(0, index),
        id,
        ...newState[newParentId].children.slice(index)
      ];
      pushToHistory(newState);
    },
    undo: () => {
      if (state.history.past.length === 0) return;
      setState(prev => ({
        ...prev,
        components: prev.history.past[prev.history.past.length - 1],
        history: {
          past: prev.history.past.slice(0, -1),
          future: [prev.components, ...prev.history.future]
        }
      }));
    },
    redo: () => {
      if (state.history.future.length === 0) return;
      setState(prev => ({
        ...prev,
        components: prev.history.future[0],
        history: {
          past: [...prev.history.past, prev.components],
          future: prev.history.future.slice(1)
        }
      }));
    }
  };

  return (
    <EditorContext.Provider value={{ ...state, actions }}>
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
