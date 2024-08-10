// import { Editor, Frame, Element } from '@craftjs/core'
// import { ResizableComponent } from '@/components/resizableComponent'
// import { ResizablePanelLayout } from '@/components/resizablePanelLayout';
// import { BasicPanelLayout } from '@/components/BasicPanelLayout';

// import { SideMenu } from '@/components/side-menu'
// import { Canvas } from '@/components/canvas'
// import { NodeButton } from '@/components/node/button'
// import {
//   NodeCardHeader,
//   NodeCard,
//   NodeCardContent,
//   NodeCardDescription,
//   NodeCardTitle,
//   NodeCardFooter
// } from '@/components/node/card'
// import { NodeAlertDialog } from '@/components/node/alert-dialog'
// import { NodeCalendar } from '@/components/node/calendar'
// import { ReactIframe } from '@/components/react-iframe'
// import { ControlPanel } from '@/components/control-panel'
// import { Viewport } from '@/components/viewport'
// import { RenderNode } from '@/components/render-node'
// import { componentsMap } from '@/components/node/components-map'
// import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
// import { NodeAccordion } from '@/components/node/accordion'
// import { NodeAvatar } from '@/components/node/avatar'
// import React, { useEffect, useRef } from 'react'

// import { renderComponents } from '@/lib/componentRenderer'
// import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';



// const buttonString = `
// <ResizableComponent width="95%" height="10%">
//   <div className="bg-gray-800 text-white p-4">
//     <h1 className="text-2xl font-bold">My Application</h1>
//   </div>
// </ResizableComponent>
// <ResizableComponent width="32%" height="50%">
//   <NodeCalendar className="p-4"></NodeCalendar>
// </ResizableComponent>
// <ResizableComponent width="20%" height="50%">
//   <NodButton className="bg-red-500 text-white px-4 py-2 rounded">
//     Button 1
//   </NodButton>
// </ResizableComponent>
// <ResizableComponent width="20%" height="50%">
//   <NodeButton>Button 2</NodeButton>
// 	<ResizableComponent width="10%" height="10%">
//   <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
//     Button 1
//   </NodeButton>
// </ResizableComponent>
// </ResizableComponent>
// <ResizableComponent width="20%" height="50%">
//   <NodeButton>Button 3</NodeButton>
// </ResizableComponent>
// <ResizableComponent width="95%" height="35%">
//   <NodeCard className="p-6 m-2">
//     <NodeCardHeader>
//       <NodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">
//         Card Title
//       </NodeCardTitle>
//       <NodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">
//         Card Description
//       </NodeCardDescription>
//     </NodeCardHeader>
//     <NodeCardContent></NodeCardContent>
//     <NodeCardFooter>
//       <NodeButton>Footer button</NodeButton>
//     </NodeCardFooter>
//   </NodeCard>
// </ResizableComponent>
// `

// const buttonString2 = `
// <ResizablePanelLayout direction="vertical">
//   <div className="bg-gray-800 text-white p-4">
//     <h1 className="text-2xl font-bold">My Application</h1>
//   </div>
//   <ResizablePanelLayout direction="horizontal">
//     <NodeCalendar className="p-4"></NodeCalendar>
//     <ResizablePanelLayout direction="vertical">
//       <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
//         Button 1
//       </NodeButton>
//       <NodeButton>Button 2</NodeButton>
//       <NodeButton>Button 3</NodeButton>
//     </ResizablePanelLayout>
//   </ResizablePanelLayout>
//   <NodeCard className="p-6 m-2">
//     <NodeCardHeader>
//       <NodeCardTitle className="bg-blue-500 text-white px-4 py-2 rounded">
//         Card Title
//       </NodeCardTitle>
//       <NodeCardDescription className="bg-blue-500 text-white px-4 py-2 rounded">
//         Card Description
//       </NodeCardDescription>
//     </NodeCardHeader>
//     <NodeCardContent></NodeCardContent>
//     <NodeCardFooter>
//       <NodeButton>Footer button</NodeButton>
//     </NodeCardFooter>
//   </NodeCard>
// </ResizablePanelLayout>
// `;

// export default function Home() {
//   const components = renderComponents(buttonString)

//   const iframeRef = useRef(null)

//   useEffect(() => {
// 		const handleMessage = (event) => {
// 			if (
// 				event.data.type === 'RESIZABLE_COMPONENT_MOUNTED' &&
// 				iframeRef.current
// 			) {
// 				const iframe = iframeRef.current
// 				const iframeDocument =
// 					iframe.contentDocument || iframe.contentWindow.document

// 				const initResize = (direction) => (e) => {
// 					e.preventDefault()
// 					const startX = e.clientX
// 					const startY = e.clientY
// 					iframe.contentWindow.postMessage(
// 						{ type: 'INIT_RESIZE', direction, startX, startY },
// 						'*'
// 					)
// 				}

// 				const resizeHandles = iframeDocument.querySelectorAll('.resize-handle')
// 				resizeHandles.forEach((handle) => {
// 					if (handle.classList.contains('right')) {
// 						handle.addEventListener('mousedown', initResize('horizontal'))
// 					} else if (handle.classList.contains('bottom')) {
// 						handle.addEventListener('mousedown', initResize('vertical'))
// 					} else if (handle.classList.contains('corner')) {
// 						handle.addEventListener('mousedown', initResize('both'))
// 					}
// 				})
// 			}
// 		}

// 		window.addEventListener('message', handleMessage)

// 		return () => {
// 			window.removeEventListener('message', handleMessage)
// 		}
// 	}, [])

//   return (
//     <section className="w-full min-h-screen flex flex-col">
			
//       <Editor
//         resolver={{
//           NodeButton,
//           Canvas,
//           NodeCardHeader,
//           NodeCard,
//           NodeCardContent,
//           NodeCardDescription,
//           NodeCardTitle,
//           NodeCardFooter,
//           NodeOneBlock,
//           NodeTwoBlocks,
//           NodeCalendar,
//           ResizableComponent,
// 					ResizablePanelLayout,
//           Element,
//           div: 'div',
//           span: 'span',
//           NodeAccordion,
//           NodeAvatar,
//           NodeAlertDialog,
// 					PanelGroup,
// 					Panel,
// 					PanelResizeHandle,
// 					BasicPanelLayout,
//         }}
//         onRender={RenderNode}
//       >
//         <div className="flex flex-1 relative overflow-hidden">
//           <SideMenu componentsMap={componentsMap} />
//           <Viewport>
//             {/* <ReactIframe
//               ref={iframeRef}
//               title="my frame"
//               className="p-4 w-full h-full page-container"
//             > */}
//               <Frame>
//                 <Element
//                   is={Canvas}
//                   id="ROOT"
//                   canvas
//                   style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     alignItems: 'flex-start'
//                   }}
//                 >
//                   {components}
// 									{/* <BasicPanelLayout /> */}

// 								</Element>
//               </Frame>
//             {/* </ReactIframe> */}
//           </Viewport>
//           <ControlPanel />
//         </div>
//       </Editor>
//     </section>
//   )
// }


import React from 'react';
import { Editor, Frame, Element, useNode } from '@craftjs/core';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

const DraggableContent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref))} style={{ padding: '10px', margin: '5px', border: '1px dashed #999' }}>
      {children}
    </div>
  );
};

DraggableContent.craft = {
  props: { children: null },
  rules: { canDrag: () => true },
};

const Text = ({ text }) => {
  return <p>{text}</p>;
};

Text.craft = {
  props: { text: 'Hello World' },
  rules: { canDrag: () => false },
};

const ResizableContainer = ({ children }) => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <PanelGroup direction="horizontal">
        <Panel minSize={20}>
          <div style={{ height: '100%', background: '#f0f0f0', overflow: 'auto' }}>
            {children[0]}
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20}>
          <div style={{ height: '100%', background: '#e0e0e0', overflow: 'auto' }}>
            {children[1]}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

ResizableContainer.craft = {
  props: { children: [] },
  rules: { canDrag: () => false },
};

const App = () => {
  return (
    <div style={{ margin: '50px' }}>
      <h1>Craft.js with Resizable Panels and Draggable Content</h1>
      <Editor resolver={{ Text, ResizableContainer, DraggableContent }}>
        <Frame>
          <Element is={ResizableContainer} canvas>
            <Element is={DraggableContent} canvas>
              <Element is={Text} text="Draggable content in left panel" />
            </Element>
            <Element is={DraggableContent} canvas>
              <Element is={Text} text="Draggable content in right panel" />
            </Element>
          </Element>
        </Frame>
      </Editor>
    </div>
  );
};

export default App;