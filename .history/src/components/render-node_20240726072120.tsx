import { useNode, useEditor } from '@craftjs/core';
import React, { useEffect, useRef, useCallback } from 'react';
import { generateComponentCode } from './codeGenerator'; // 确保路径正确

export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    isSelected,
    dom,
    moveable,
    connectors: { drag },
    parent,
    deletable,
    props,
    data,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
    data: node.data,
  }));

  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (dom && id !== 'ROOT') {
      if (isHover) {
        dom.classList.toggle('component-hover', isHover);
      } else {
        dom.classList.remove('component-hover');
      }
    }
  }, [dom, isHover]);

  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const code = generateComponentCode({
      data: {
        displayName: data.custom.displayName || data.displayName,
        props,
        nodes: data.nodes,
        linkedNodes: data.linkedNodes,
      },
    });
    console.log(`Code for component ${data.custom.displayName || data.displayName || 'Unknown'}:`);
    console.log(code);
  }, [data, props]);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      node.addEventListener('click', handleClick);
      return () => {
        node.removeEventListener('click', handleClick);
      };
    }
  }, [handleClick]);

  return (
    <div ref={nodeRef}>
      {render}
    </div>
  );
};