import { Editor, Frame, Element } from '@craftjs/core'
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
import { NodeAlertDialog } from '@/components/node/alert-dialog'
import { NodeCalendar } from '@/components/node/calendar' // 新增导入
import { ReactIframe } from '@/components/react-iframe'
import { ControlPanel } from '@/components/control-panel'
import { Viewport } from '@/components/viewport'
import { RenderNode } from '@/components/render-node'
import { componentsMap } from '@/components/node/components-map'
import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
import {
	NodeAccordion
	// NodeAccordionItem,
	// NodeAccordionTrigger,
	// NodeAccordionContent
} from '@/components/node/accordion'
import { NodeAvatar } from '@/components/node/avatar'
import React, { useEffect, useRef } from 'react'

const buttonString = `
<ResizableComponent width="95%" height="10%">
  <div className="bg-gray-800 text-white p-4">
    <h1 className="text-2xl font-bold">My Application</h1>
  </div>
</ResizableComponent>
<ResizableComponent width="30%" height="50%">
  <NodeCalendar className="p-4"></NodeCalendar>
</ResizableComponent>
<ResizableComponent width="20%" height="50%">
  <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
    Button 1
  </NodeButton>
</ResizableComponent>
<ResizableComponent width="20%" height="10%">
  <NodeButton>Button 2</NodeButton>
</ResizableComponent>
<ResizableComponent width="20%" height="10%">
  <NodeButton>Button 3</NodeButton>
</ResizableComponent>
<ResizableComponent width="20%" height="10%">
  <NodeButton>Button 4</NodeButton>
</ResizableComponent>
<ResizableComponent width="40%" height="auto">
  <NodeCard className="p-6 m-2">
    <NodeCardHeader>
      <NodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">
        Card Title
      </NodeCardTitle>
      <NodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">
        Card Description
      </NodeCardDescription>
    </NodeCardHeader>
    <NodeCardContent></NodeCardContent>
    <NodeCardFooter>
      <NodeButton>Footer button</NodeButton>
    </NodeCardFooter>
  </NodeCard>
</ResizableComponent>
`

const pageLayoutString = `
<ResizableComponent width="100%" height="10%">
  <div className="bg-gray-800 text-white p-4">
    <h1 className="text-2xl font-bold">My Application</h1>
  </div>
</ResizableComponent>
<ResizableComponent width="100%" height="50%">
  <div className="flex h-full">
    <ResizableComponent width="20%" height="100%">
      <div className="bg-gray-100 p-4 h-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Section 1</AccordionTrigger>
            <AccordionContent>Content for section 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Section 2</AccordionTrigger>
            <AccordionContent>Content for section 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ResizableComponent>
    <ResizableComponent width="80%" height="100%">
      <div className="p-4 h-full overflow-auto">
        <ResizableComponent width="30%" height="30%">
          <Calendar className="p-4" />
        </ResizableComponent>
        <ResizableComponent width="20%" height="10%">
          <Button className="bg-red-500 text-white px-4 py-2 rounded">Button 1</Button>
        </ResizableComponent>
        <ResizableComponent width="20%" height="10%">
          <Button>Button 2</Button>
        </ResizableComponent>
        <ResizableComponent width="20%" height="10%">
          <Button>Button 3</Button>
        </ResizableComponent>
        <ResizableComponent width="20%" height="10%">
          <Button>Button 4</Button>
        </ResizableComponent>
        <ResizableComponent width="40%" height="auto">
          <Card className="p-6 m-2">
            <CardHeader>
              <CardTitle className="bg-blue-500 text-white px-4 py-2 rounded">Card Title</CardTitle>
              <CardDescription className="bg-blue-500 text-white px-4 py-2 rounded">Card Description</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button>Footer button</Button>
            </CardFooter>
          </Card>
        </ResizableComponent>
        <ResizableComponent width="20%" height="auto">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </ResizableComponent>
      </div>
    </ResizableComponent>
  </div>
</ResizableComponent>
<ResizableComponent width="100%" height="10%">
  <div className="bg-gray-800 text-white p-4 text-center">
    <p>&copy; 2024 My Application. All rights reserved.</p>
  </div>
</ResizableComponent>
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
	ResizableComponent,
	NodeAccordion,
	// NodeAccordionItem,
	// NodeAccordionTrigger,
	// NodeAccordionContent,
	NodeAvatar,
	NodeAlertDialog
}


// function renderComponents(componentsString) {
// 	const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|([^<]+)/gs
// 	const components = []

// 	let match
// 	while ((match = regex.exec(componentsString))) {
// 		const [, componentName, attributes, children, textContent] = match

// 		if (componentName) {
// 			let Component = componentMap[componentName]
// 			const props = {}

// 			if (attributes) {
// 				const attributeRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)"|'([^']*)')/g
// 				let attributeMatch
// 				while ((attributeMatch = attributeRegex.exec(attributes))) {
// 					const [, name, jsValue, doubleQuotedValue, singleQuotedValue] =
// 						attributeMatch
// 					if (name === 'is') {
// 						Component =
// 							componentMap[jsValue || doubleQuotedValue || singleQuotedValue]
// 					} else if (name === 'className') {
// 						props[name] = `${props[name] || ''} ${
// 							jsValue || doubleQuotedValue || singleQuotedValue
// 						}`.trim()
// 					} else {
// 						props[name] = jsValue || doubleQuotedValue || singleQuotedValue
// 					}
// 				}
// 			}

// 			if (children) {
// 				props.children = renderComponents(children)
// 			}

// 			if (Component) {
// 				if (Component === ResizableComponent) {
// 					components.push(
// 						<Element
// 							key={components.length}
// 							is={ResizableComponent}
// 							canvas
// 							{...props}
// 						>
// 							{props.children}
// 						</Element>
// 					)
// 				} else {
// 					components.push(
// 						<Element key={components.length} is={Component} {...props} />
// 					)
// 				}
// 			} else {
// 				console.warn(`Component ${componentName} not found in componentMap`)
// 			}
// 		} else if (textContent) {
// 			components.push(textContent.trim())
// 		}
// 	}

// 	return components
// }

function renderComponents(componentsString) {
  const regex = /<(\w+)(\s[^>]*)?>(.*?)<\/\1>|<(\w+)(\s[^>]*)?\/>|([^<]+)/gs;
  const components = [];

  let match;
  while ((match = regex.exec(componentsString))) {
    const [, componentName, attributes, children, selfClosingName, selfClosingAttributes, textContent] = match;

    if (componentName || selfClosingName) {
      const name = componentName || selfClosingName;
      let Component = componentMap[name];
      const props = {};

      const attributesString = attributes || selfClosingAttributes;
      if (attributesString) {
        const attributeRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)"|'([^']*)')/g;
        let attributeMatch;
        while ((attributeMatch = attributeRegex.exec(attributesString))) {
          const [, name, jsValue, doubleQuotedValue, singleQuotedValue] = attributeMatch;
          if (name === 'is') {
            Component = componentMap[jsValue || doubleQuotedValue || singleQuotedValue];
          } else if (name === 'className') {
            props[name] = `${props[name] || ''} ${jsValue || doubleQuotedValue || singleQuotedValue}`.trim();
          } else {
            props[name] = jsValue || doubleQuotedValue || singleQuotedValue;
          }
        }
      }

      if (children) {
        props.children = renderComponents(children);
      }

      if (Component) {
        if (Component === ResizableComponent) {
          components.push(
            <Element
              key={components.length}
              is={ResizableComponent}
              canvas
              {...props}
            >
              {props.children}
            </Element>
          );
        } else {
          components.push(
            <Element key={components.length} is={Component} {...props} />
          );
        }
      } else {
        // 处理原生 HTML 元素
        components.push(React.createElement(name, { key: components.length, ...props }, props.children));
      }
    } else if (textContent) {
      components.push(textContent.trim());
    }
  }

  return components;
}


export default function Home() {
	const components = renderComponents(buttonString)
	// const components = renderComponents(pageLayoutString)

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
					NodeCalendar, // 新增 Calendar 组件
					ResizableComponent,
					Element,
					div: 'div',
					span: 'span',
					NodeAccordion,
					// NodeAccordionItem,
					// NodeAccordionTrigger,
					// NodeAccordionContent,
					NodeAvatar,
					NodeAlertDialog
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
								<Element
									is={Canvas}
									id="ROOT"
									canvas
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										alignItems: 'flex-start'
									}}
								>
									{components}
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
