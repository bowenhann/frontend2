// import { useNode, useEditor } from '@craftjs/core';
// import React, { useEffect, useRef, useCallback } from 'react';
// // import ReactDOM from 'react-dom';
// // import { Move, ArrowUp, Trash2 } from 'lucide-react';
// // import { Button } from '/ui/button';

// export const RenderNode = ({ render }: { render: React.ReactNode }) => {
//   const { id } = useNode();
//   const { actions, query, isActive } = useEditor((_, query) => ({
//     isActive: query.getEvent('selected').contains(id),
//   }));

//   const {
//     isHover,
//     isSelected,
//     dom,
//     moveable,
//     connectors: { drag },
//     parent,
//     deletable,
//     props,
//   } = useNode((node) => ({
//     isHover: node.events.hovered,
//     isSelected: node.events.selected,
//     dom: node.dom,
//     name: node.data.custom.displayName || node.data.displayName,
//     moveable: query.node(node.id).isDraggable(),
//     deletable: query.node(node.id).isDeletable(),
//     parent: node.data.parent,
//     props: node.data.props,
//   }));

//   useEffect(() => {
//     if (dom && id !== 'ROOT') {
//       if (isHover) {
//         // If either active or hover, add corresponding classes

//         dom.classList.toggle('component-hover', isHover);
//       } else {
//         // If neither active nor hover, remove both classes
//         dom.classList.remove('component-hover');
//       }
//     }
//   }, [dom, isHover]);

//   return <>{render}</>;
// };


// components/render-node.tsx
import React from 'react';
import { useEditor } from '../lib/editor-core';
import { componentMap } from './node/components-map';

export const RenderNode: React.FC<{ id: string }> = ({ id }) => {
  const { components, selectedId, actions } = useEditor();
  const component = components[id];
  const [isHovered, setIsHovered] = React.useState(false);

  if (!component) return null;

  const Component = componentMap[component.type];
  if (!Component) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        actions.selectComponent(id);
      }}
      style={{
        position: 'relative',
        outline: isHovered ? '2px solid blue' : 'none',
        boxShadow: selectedId === id ? '0 0 0 2px red' : 'none'
      }}
    >
      <Component {...component.props}>
        {component.children?.map(childId => (
          <RenderNode key={childId} id={childId} />
        ))}
      </Component>
    </div>
  );
};