import { Editor, Frame, Element } from '@craftjs/core'
import {
	ResizableContainer,
	ResizableItem
} from '@/components/resizeableFlexContainer'
import { ResizableComponent } from '@/components/resizableComponent'

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
import React from 'react'

const buttonString = `
<NodeCalendar className="p-4"></NodeCalendar>
  <NodeButton className="bg-blue-500 text-white px-4 py-2 rounded">Button 1</NodeButton>
  <NodeButton>Button 2</NodeButton>
  <NodeButton>Button 3</NodeButton>
  <NodeButton>Button 4</NodeButton>
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
	span: 'span'
	// 其他组件...
}



function renderComponents(componentsString: string) {
	const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|([^<]+)/gs
	const components = []

	let match
	while ((match = regex.exec(componentsString))) {
		const [, componentName, attributes, children, textContent] = match

		if (componentName) {
			const Component = componentMap[componentName]

			if (Component) {
				const props = {}

				if (attributes) {
					const attributeRegex = /(\w+)=(?:"([^"]*)"|'([^']*)')/g
					let attributeMatch
					while ((attributeMatch = attributeRegex.exec(attributes))) {
						const [, name, doubleQuotedValue, singleQuotedValue] =
							attributeMatch
						if (name === 'className') {
							props[name] = `${props[name] || ''} ${
								doubleQuotedValue || singleQuotedValue
							}`.trim()
						} else {
							props[name] = doubleQuotedValue || singleQuotedValue
						}
					}
				}

				if (children) {
					props.children = renderComponents(children)
				}

				components.push(<Component key={components.length} {...props} />)
			}
		} else if (textContent) {
			components.push(textContent.trim())
		}
	}

	return components.map((component) => {
		if (typeof component === 'string') {
			return component
		} else {
			const { type, props } = component
			const { children, ...restProps } = props

			if (Array.isArray(children)) {
				console.log('arraychildren', children, restProps)
				return React.createElement(
					type,
					restProps,
					...children.map((child, index) =>
						typeof child === 'string'
							? child
							: React.cloneElement(child, { key: index })
					)
				)
			} else if (children) {
				console.log('children', children, restProps)
				return React.createElement(type, restProps, children)
			} else {
				console.log('nochildren', children, restProps)
				return React.createElement(type, restProps)
			}
		}
	})
}

export default function Home() {
	const components = renderComponents(buttonString)

	console.log('components', components)

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
				}}
				onRender={RenderNode}
			>
				<div className="flex flex-1 relative overflow-hidden">
					<SideMenu componentsMap={componentsMap} />
					<Viewport>
						<ReactIframe
							title="my frame"
							className="p-4 w-full h-full page-container"
						>
							<Frame>
								<Element is={Canvas} id="ROOT" canvas>
									{/* <NodeButton>Button 1</NodeButton>
                  <NodeButton>Button 2</NodeButton>
                  <NodeButton>Button 3</NodeButton>
                  <NodeButton>Button 4</NodeButton> */}

									{components}

									<Element is={ResizableContainer} canvas>
										<Element is={ResizableItem} canvas>
											Item 1
										</Element>
										<Element is={ResizableItem} canvas>
											Item 2
										</Element>
										<Element is={ResizableItem} canvas>
											Item 3
										</Element>
									</Element>
								</Element>

                <Element is={ResizableContainer} canvas>

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
