import { Editor, Frame, Element } from '@craftjs/core'
import {
	ResizableContainer,
	ResizableItem
} from '@/components/resizeableFlexContainer'
import { ResizableComponent } from '@/components/resizableComponent'
// import { FlexContainer } from '@/components/flex-container';
import { v4 as uuidv4 } from 'uuid';

import { SideMenu } from '@/components/side-menu'
import { Header } from '@/components/header'
import { Canvas } from '@/components/canvas'
import { NodeButton } from '@/components/node/button'
import {
	NodeCardHeader,
	NodeCard,
	NodeCardContent,
	NodeCardDescription,
	NodeCardTitle,
	NodeCardFooter
} from '@/components/node/card'
import { NodeCalendar } from '@/components/node/calendar' // 新增导入
import { ReactIframe } from '@/components/react-iframe'
import { ControlPanel } from '@/components/control-panel'
import { Viewport } from '@/components/viewport'
import { RenderNode } from '@/components/render-node'
import { componentsMap } from '@/components/node/components-map'
import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
import React, { useEffect, useRef } from 'react'

// const buttonString = `
// <NodeCalendar className="p-4"></NodeCalendar>
//   <NodeButton className="bg-blue-500 text-white px-4 py-2 rounded">Button 1</NodeButton>
//   <NodeButton>Button 2</NodeButton>
//   <NodeButton>Button 3</NodeButton>
//   <NodeButton>Button 4</NodeButton>
//   <NodeCard className="p-6 m-2">
//           <NodeCardHeader>
//             <NodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">Card Title</NodeCardTitle>
//             <NodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">Card Description</NodeCardDescription>
//           </NodeCardHeader>
//           <NodeCardContent></NodeCardContent>
//           <NodeCardFooter>
//             <NodeButton>Footer button</NodeButton>
//           </NodeCardFooter>
//   </NodeCard>
  
// `

const buttonString = `
<Element is={ResizableComponent} width="30%" height="30%" canvas>
  <NodeCalendar className="p-4"></NodeCalendar>
</Element>
<Element is={ResizableComponent} width="20%" height="10%" canvas>
  <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">Button 1</NodeButton>
</Element>
<Element is={ResizableComponent} width="20%" height="10%" canvas>
  <NodeButton>Button 2</NodeButton>
</Element>
<Element is={ResizableComponent} width="20%" height="10%" canvas>
  <NodeButton>Button 3</NodeButton>
</Element>
<Element is={ResizableComponent} width="20%" height="10%" canvas>
  <NodeButton>Button 4</NodeButton>
</Element>
<Element is={ResizableComponent} width="40%" height="auto" canvas>
  <NodeCard className="p-6 m-2">
    <NodeCardHeader>
      <NodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">Card Title</NodeCardTitle>
      <NodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">Card Description</NodeCardDescription>
    </NodeCardHeader>
    <NodeCardContent></NodeCardContent>
    <NodeCardFooter>
      <NodeButton>Footer button</NodeButton>
    </NodeCardFooter>
  </NodeCard>
</Element>
`

const componentMap = {
	NodeButton,
	NodeCard,
	NodeCardHeader,
	NodeCardTitle,
	NodeCardDescription,
	NodeCardContent,
	NodeCardFooter,
	NodeCalendar, // 新增 Calendar 组件
	div: 'div',
	span: 'span',
	ResizableComponent
	// 其他组件...
}

function renderComponents(componentsString) {
  const regex = /<(\w+)(\s[^>]*)?>([\s\S]*?)<\/\1>|<(\w+)(\s[^>]*)?\/>/gs
  const components = []

  let match
  while ((match = regex.exec(componentsString))) {
    const [, componentName, attributes, children, selfClosingName, selfClosingAttributes] = match

    const name = componentName || selfClosingName
    const attrs = attributes || selfClosingAttributes || ''
    const Component = componentMap[name] || name

    if (Component) {
      const props = {}

      const attributeRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)"|'([^']*)')/g
      let attributeMatch
      while ((attributeMatch = attributeRegex.exec(attrs))) {
        const [, name, jsValue, doubleQuotedValue, singleQuotedValue] = attributeMatch
        if (name === 'className') {
          props[name] = `${props[name] || ''} ${jsValue || doubleQuotedValue || singleQuotedValue}`.trim()
        } else if (jsValue) {
          try {
            props[name] = Function(`return ${jsValue}`)()
          } catch (e) {
            props[name] = jsValue
          }
        } else {
          props[name] = doubleQuotedValue || singleQuotedValue
        }
      }

      if (children) {
        props.children = renderComponents(children)
      }

      if (name === 'Element') {
        // Preserve the Element and ResizableComponent structure
        const { is, width, height, ...restProps } = props
        components.push(
          React.createElement(
            Element,
            { key: components.length, ...restProps },
            React.createElement(ResizableComponent, { width, height }, props.children)
          )
        )
      } else {
        components.push(React.createElement(Component, { key: components.length, ...props }))
      }
    }
  }

  return components
}


export default function Home() {
	const components = renderComponents(buttonString)
	console.log('hi', components)

	console.log('components', components)

	const iframeRef = useRef(null)

	useEffect(() => {
		const handleMessage = (event) => {
			if (
				event.data.type === 'RESIZABLE_COMPONENT_MOUNTED' &&
				iframeRef.current
			) {
				const iframe = iframeRef.current
				const iframeDocument =
					iframe.contentDocument || iframe.contentWindow.document

				const initResize = (direction) => (e) => {
					e.preventDefault()
					const startX = e.clientX
					const startY = e.clientY
					iframe.contentWindow.postMessage(
						{ type: 'INIT_RESIZE', direction, startX, startY },
						'*'
					)
				}

				const resizeHandles = iframeDocument.querySelectorAll('.resize-handle')
				resizeHandles.forEach((handle) => {
					if (handle.classList.contains('right')) {
						handle.addEventListener('mousedown', initResize('horizontal'))
					} else if (handle.classList.contains('bottom')) {
						handle.addEventListener('mousedown', initResize('vertical'))
					} else if (handle.classList.contains('corner')) {
						handle.addEventListener('mousedown', initResize('both'))
					}
				})
			}
		}

		window.addEventListener('message', handleMessage)

		return () => {
			window.removeEventListener('message', handleMessage)
		}
	}, [])

	return (
		<section className="w-full min-h-screen flex flex-col">
			{/* <Header /> */}
			<Editor
				resolver={{
					NodeButton,
					Canvas,
					NodeCardHeader,
					NodeCard,
					NodeCardContent,
					NodeCardDescription,
					NodeCardTitle,
					NodeCardFooter,
					NodeOneBlock,
					NodeTwoBlocks,
					ResizableContainer,
					ResizableItem,
					NodeCalendar, // 新增 Calendar 组件
					ResizableComponent,
					Element,
					div: 'div',
					span: 'span'
				}}
				onRender={RenderNode}
			>
				<div className="flex flex-1 relative overflow-hidden">
					<SideMenu componentsMap={componentsMap} />
					<Viewport>
						<ReactIframe
							ref={iframeRef}
							title="my frame"
							className="p-4 w-full h-full page-container"
						>
							<Frame>
								<Element is={Canvas} id="ROOT" canvas style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
									{/* <NodeButton>Button 1</NodeButton>
                  <NodeButton>Button 2</NodeButton>
                  <NodeButton>Button 3</NodeButton>
                  <NodeButton>Button 4</NodeButton> */}

									{/* {components} */}
                  {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', height: '100%' }}> */}
                  {/* <FlexContainer> */}

									{/* <Element is={ResizableComponent}  width = '10%' height = '10%' canvas>
										Button 1
									</Element>
									<Element is={ResizableComponent}  width = '10%' height = '10%' canvas>
										Button 1
									</Element>
									<Element is={ResizableComponent}  width = '10%' height = '10%' canvas>
										Button 1
									</Element> */}

                  {/* </FlexContainer> */}
                  {/* </div> */}

								</Element>
							</Frame>
						</ReactIframe>
					</Viewport>

					<ControlPanel />
				</div>
			</Editor>
		</section>
	)
}

{
	/* export default function Home() {
  return (
    <Editor resolver={{ ResizableContainer, ResizableItem }}>
      <Frame>
        <Element is={ResizableContainer} canvas>
          <Element is={ResizableItem} canvas>Item 1</Element>
          <Element is={ResizableItem} canvas>Item 2</Element>
          <Element is={ResizableItem} canvas>Item 3</Element>
        </Element>
      </Frame>
    </Editor>
  );
} */
}
