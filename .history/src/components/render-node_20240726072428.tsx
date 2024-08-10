import { useNode, useEditor } from '@craftjs/core';
import React, { useEffect, useCallback } from 'react';
import { getOutputCode } from '@/lib/code-gen';

export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { connect, drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const { nodes } = useEditor((state) => ({
    nodes: state.nodes,
  }));

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add('component-selected');
      else dom.classList.remove('component-selected');
    }
  }, [dom, isActive, isHover]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const { output } = getOutputCode(nodes);
    console.log(`Code for component ${name || 'Unknown'}:`);
    console.log(output);
  }, [name, nodes]);

  return (
    <div ref={connect} onClick={handleClick}>
      {render}
    </div>
  );
};