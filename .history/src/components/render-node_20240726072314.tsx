import { useNode, useEditor } from '@craftjs/core';
import React, { useEffect, useCallback, useState } from 'react';
import { generateComponentCode } from '/codeGenerator'; // 确保路径正确

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

  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (dom && id !== 'ROOT') {
      if (isHover) {
        dom.classList.toggle('component-hover', isHover);
        setShowOverlay(true);
      } else {
        dom.classList.remove('component-hover');
        setShowOverlay(false);
      }
    }
  }, [dom, isHover, id]);

  const handleClick = useCallback((e: React.MouseEvent) => {
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

  return (
    <div style={{ position: 'relative' }}>
      {render}
      {showOverlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0)', // 完全透明
            cursor: 'pointer',
          }}
          onClick={handleClick}
        />
      )}
    </div>
  );
};