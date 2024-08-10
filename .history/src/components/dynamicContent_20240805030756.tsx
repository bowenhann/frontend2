import React, { useEffect } from 'react'
import { useNode, useEditor, Element } from '@craftjs/core'
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

export const InitialContent = () => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div ref={(ref) => connect(drag(ref))}>
      Initial Content
    </div>
  )
}

InitialContent.craft = {
  displayName: 'Initial Content',
}

export const DynamicContent = ({ children }) => {
  const {
    connectors: { connect, drag },
    id
  } = useNode()
  const { actions, query } = useEditor()

  useEffect(() => {
    const timer = setTimeout(() => {
      actions.setProp(id, (props) => {
        props.showNewContent = true
      })
      console.log('Dynamic content updated')
    }, 2000)

    return () => clearTimeout(timer)
  }, [id, actions])

  const {
    showNewContent
  } = useNode((node) => ({
    showNewContent: node.data.props.showNewContent
  }))

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="bg-yellow-100 p-2 m-2 rounded"
    >
      {showNewContent ? (
        <Element is={NewContent} canvas />
      ) : (
        <Element is={InitialContent} canvas />
      )}
      {children}
    </div>
  )
}

DynamicContent.craft = {
  displayName: 'Dynamic Content',
  props: { showNewContent: false },
  rules: {
    canDrag: () => true,
  },
}