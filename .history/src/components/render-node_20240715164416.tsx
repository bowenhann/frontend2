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


import React from 'react';
import { useNode } from '../lib/editor-core';
import { NodeButton, NodeCard, NodeCardHeader, NodeCardContent, NodeCardFooter, NodeCardTitle, NodeCardDescription } from '@/components/node/components-map';

const componentMap: Record<string, React.ComponentType<any>> = {
  NodeButton,
  NodeCard,
  NodeCardHeader,
  NodeCardContent,
  NodeCardFooter,
  NodeCardTitle,
  NodeCardDescription,
};

export const RenderNode: React.FC<{ id: string }> = ({ id }) => {
  const { ref, data, isSelected, isHovered, select } = useNode(id);
  
  if (!data) return null;

  const Component = componentMap[data.type];
  if (!Component) return null;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onClick={(e) => {
        e.stopPropagation();
        select();
      }}
      style={{
        position: 'relative',
        outline: isHovered ? '2px solid blue' : 'none',
        boxShadow: isSelected ? '0 0 0 2px red' : 'none'
      }}
    >
      <Component {...data.props}>
        {data.children?.map(childId => (
          <RenderNode key={childId} id={childId} />
        ))}
      </Component>
    </div>
  );
};
