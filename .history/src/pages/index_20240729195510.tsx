import { Editor, Frame, Element } from '@craftjs/core'
import { ResizableComponent } from '@/components/resizableComponent'
import { SideMenu } from '@/components/side-menu'
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
import { NodeCalendar } from '@/components/node/calendar'
import { ReactIframe } from '@/components/react-iframe'
import { ControlPanel } from '@/components/control-panel'
import { Viewport } from '@/components/viewport'
import { RenderNode } from '@/components/render-node'
import { componentsMap } from '@/components/node/components-map'
import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
import { NodeAccordion } from '@/components/node/accordion'
import { NodeAvatar } from '@/components/node/avatar'
import React, { useEffect, useRef } from 'react'

import { renderComponents } from '@/lib/c'

const buttonString = `
<ResizableComponent width="95%" height="10%">
  <div className="bg-gray-800 text-white p-4">
    <h1 className="text-2xl font-bold">My Application</h1>
  </div>
</ResizableComponent>
// ... rest of the buttonString ...
`

export default function Home() {
  const components = renderComponents(buttonString)

  const iframeRef = useRef(null)

  useEffect(() => {
    // ... rest of the useEffect logic ...
  }, [])

  return (
    <section className="w-full min-h-screen flex flex-col">
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
          NodeCalendar,
          ResizableComponent,
          Element,
          div: 'div',
          span: 'span',
          NodeAccordion,
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