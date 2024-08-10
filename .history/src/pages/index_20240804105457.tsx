// import React, { useEffect, useRef, useState } from 'react'
// import { Editor, Frame, Element, useEditor  } from '@craftjs/core'
// import { ResizableComponent } from '@/components/resizableComponent'
// import { ResizablePanelLayout } from '@/components/resizablePanelLayout'
// import { BasicPanelLayout } from '@/components/BasicPanelLayout'
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
// import { NodeAlert } from '@/components/node/alert'
// import { NodeAspectRatio } from '@/components/node/aspect-ratio'
// import { NodeBadge } from '@/components/node/badge'
// import { NodeCheckbox } from '@/components/node/checkbox'
// import { NodeCollapsible } from '@/components/node/collapsible'
// import { NodeCommand } from '@/components/node/command'
// import { NodeContextMenu } from '@/components/node/context-menu'
// import { NodeDialog } from '@/components/node/dialog'

// import { renderComponents } from '@/lib/componentRenderer'

// const buttonString1 = `
// <ResizableComponent width="95%" height="10%">
//   <div className="bg-gray-800 text-white p-4">
//     <h1 className="text-2xl font-bold">My Application</h1>
//   </div>
// </ResizableComponent>
// <ResizableComponent width="32%" height="50%">
//   <NodeCalendar className="p-4"></NodeCalendar>
// </ResizableComponent>
// <ResizableComponent width="20%" height="50%">
//   <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
//     Button 1
//   </NodeButton>
// </ResizableComponent>
// <ResizableComponent width="20%" height="50%">
//   <NodeButton>Button 2</NodeButton>
//   <ResizableComponent width="10%" height="10%">
//     <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
//       Button 1
//     </NodeButton>
//   </ResizableComponent>
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


// const placeholderString = '<div>Loading...</div>'

// const LoadingComponent = () => <div>Loading...</div>

// const predefinedComponents = [
//   {
//     type: ResizableComponent,
//     props: { width: "95%", height: "10%" },
//     children: (
//       <div className="bg-gray-800 text-white p-4">
//         <h1 className="text-2xl font-bold">My Application</h1>
//       </div>
//     )
//   },
//   {
//     type: ResizableComponent,
//     props: { width: "32%", height: "50%" },
//     children: <NodeCalendar className="p-4" />
//   },
//   {
//     type: ResizableComponent,
//     props: { width: "20%", height: "50%" },
//     children: (
//       <NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
//         Button 1
//       </NodeButton>
//     )
//   },
//   // ... 其他组件定义 ...
// ]

// const SimpleDiv = ({ children, ...props }) => {
//   return <div {...props}>{children}</div>
// }

// const DynamicContent = () => {
//   const { actions, query } = useEditor()
  
//   useEffect(() => {
//     const addComponentsSafely = async () => {
//       try {
//         console.log("Starting to add components...")
        
//         actions.clearEvents()

//         // 添加一个简单的 div
//         try {
//           await new Promise((resolve, reject) => {
//             actions.add(
//               <Element
//                 canvas
//                 is={SimpleDiv}
//                 background="blue"
//                 padding={20}
//               >
//                 This is a simple div
//               </Element>,
//               'ROOT'
//             )
//             const addedNode = query.node('simple-div').get()
//             if (addedNode) {
//               resolve(addedNode)
//             } else {
//               reject(new Error('Failed to add simple div'))
//             }
//           })
//           console.log("Successfully added simple div")
//         } catch (error) {
//           console.error("Error adding simple div:", error)
//         }

//         console.log("Finished adding components")
//       } catch (error) {
//         console.error("Error in addComponentsSafely:", error)
//       }
//     }

//     setTimeout(addComponentsSafely, 100)
//   }, [actions, query])

//   return null
// }




// export default function Home() {
//   const [buttonString, setButtonString] = useState(placeholderString)
//   const iframeRef = useRef(null)

//   useEffect(() => {
//     // 模拟加载过程
//     setTimeout(() => {
//       setButtonString(buttonString1)
//     }, 100) // 100ms 延迟，模拟很短的加载时间
//   }, [])

//   const components = renderComponents(buttonString)

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (
//         event.data.type === 'RESIZABLE_COMPONENT_MOUNTED' &&
//         iframeRef.current
//       ) {
//         const iframe = iframeRef.current
//         const iframeDocument =
//           iframe.contentDocument || iframe.contentWindow.document

//         const initResize = (direction) => (e) => {
//           e.preventDefault()
//           const startX = e.clientX
//           const startY = e.clientY
//           iframe.contentWindow.postMessage(
//             { type: 'INIT_RESIZE', direction, startX, startY },
//             '*'
//           )
//         }

//         const resizeHandles = iframeDocument.querySelectorAll('.resize-handle')
//         resizeHandles.forEach((handle) => {
//           if (handle.classList.contains('right')) {
//             handle.addEventListener('mousedown', initResize('horizontal'))
//           } else if (handle.classList.contains('bottom')) {
//             handle.addEventListener('mousedown', initResize('vertical'))
//           } else if (handle.classList.contains('corner')) {
//             handle.addEventListener('mousedown', initResize('both'))
//           }
//         })
//       }
//     }

//     window.addEventListener('message', handleMessage)

//     return () => {
//       window.removeEventListener('message', handleMessage)
//     }
//   }, [])

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
//           ResizablePanelLayout,
//           Element,
//           div: 'div',
//           span: 'span',
//           NodeAccordion,
//           NodeAvatar,
//           NodeAlertDialog,
//           NodeAlert,
//           NodeAspectRatio,
//           NodeBadge,
//           NodeCheckbox,
//           NodeCollapsible,
//           NodeCommand,
//           NodeContextMenu,
//           NodeDialog,
// 					LoadingComponent,
// 					DynamicContent
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
//                   {/* {components} */}
// 									{/* <Element is={LoadingComponent} id="loading" /> */}
//                   <Element is={DynamicContent} id="dynamic" />
//                 </Element>
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
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core';

const SimpleComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(dom) => connect(drag(dom))} 
      className="border border-gray-300 p-4 m-2"
    >
      <h2 className="text-lg font-bold mb-2">Simple Component</h2>
      <p className="mb-2">This is a simple component</p>
      {children}
    </div>
  );
};

const Button = () => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <button
      ref={(dom) => connect(drag(dom))}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
    >
      Click me
    </button>
  );
};

const DynamicContent = () => {
  const { actions, query } = useEditor();

  React.useEffect(() => {
    const addComponents = () => {
      // Create the main SimpleComponent
      const simpleComponentNode = query.createNode(React.createElement(SimpleComponent));
      actions.add(simpleComponentNode, 'ROOT');

      // Create two Button components and add them to the SimpleComponent
      for (let i = 0; i < 2; i++) {
        const buttonNode = query.createNode(React.createElement(Button));
        actions.add(buttonNode, simpleComponentNode.id);
      }
    };

    setTimeout(addComponents, 100);
  }, [actions, query]);

  return null;
};

SimpleComponent.craft = {
  displayName: 'Simple Component',
};

Button.craft = {
  displayName: 'Button',
};

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Craft.js Dynamic Content Demo</h1>
      <Editor resolver={{ SimpleComponent, Button, DynamicContent }}>
        <Frame>
          <Element is={DynamicContent} id="dynamic" />
        </Frame>
      </Editor>
    </div>
  );
}