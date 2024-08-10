// lib/editor-core.ts
import React, { createContext, useContext, useState, useCallback } from 'react';

type Component = {
  id: string;
  type: string;
  props: Record<string, any>;
  children: string[];
};

type EditorState = {
  components: Record<string, Component>;
  rootComponentIds: string[];
  selectedComponentId: string | null;
};

type EditorContextType = {
  state: EditorState;
  addComponent: (type: string, props: Record<string, any>, parentId?: string) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
};

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EditorState>({
    components: {},
    rootComponentIds: [],
    selectedComponentId: null,
  });

  const addComponent = useCallback((type: string, props: Record<string, any>, parentId?: string) => {
    const id = Date.now().toString();
    setState(prevState => {
      const newComponent: Component = { id, type, props, children: [] };
      const newComponents = { ...prevState.components, [id]: newComponent };
      
      if (parentId && prevState.components[parentId]) {
        newComponents[parentId] = {
          ...newComponents[parentId],
          children: [...newComponents[parentId].children, id],
        };
        return { ...prevState, components: newComponents };
      } else {
        return {
          ...prevState,
          components: newComponents,
          rootComponentIds: [...prevState.rootComponentIds, id],
        };
      }
    });
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
    setState(prevState => ({
      ...prevState,
      components: {
        ...prevState.components,
        [id]: { ...prevState.components[id], ...updates },
      },
    }));
  }, []);

  const removeComponent = useCallback((id: string) => {
    setState(prevState => {
      const { [id]: removedComponent, ...remainingComponents } = prevState.components;
      const newState = { ...prevState, components: remainingComponents };

      // Remove from parent's children if exists
      Object.values(newState.components).forEach(component => {
        component.children = component.children.filter(childId => childId !== id);
      });

      // Remove from rootComponentIds if it's a root component
      newState.rootComponentIds = newState.rootComponentIds.filter(componentId => componentId !== id);

      return newState;
    });
  }, []);

  const selectComponent = useCallback((id: string | null) => {
    setState(prevState => ({ ...prevState, selectedComponentId: id }));
  }, []);

  const contextValue: EditorContextType = {
    state,
    addComponent,
    updateComponent,
    removeComponent,
    selectComponent,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === null) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};