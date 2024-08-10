import React, { useEffect, useState } from 'react'
import { useNode, useEditor } from '@craftjs/core'
import { NodeButton } from '@/components/node/button'
import { ResizableComponent } from '@/components/resizableComponent'

export const NewContent = () => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div ref={(ref) => connect(drag(ref))}>
      <ResizableComponent width="20%" height="20%">
        Hi
      </ResizableComponent>
    </div>
  )
}

NewContent.craft = {
  displayName: 'New Content',
}
import React from 'react'
import { useNode } from '@craftjs/core'

export const DynamicContent = ({ children }) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="bg-yellow-100 p-2 m-2 rounded"
    >
      {children}
    </div>
  )
}

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  rules: {
    canDrag: () => true,
  },
}