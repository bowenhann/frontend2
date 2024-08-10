import React, { useEffect, useRef } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { ResizableComponent } from '@/components/ResizableComponent';
import { ReactIframe } from '@/components/react-iframe';
// ... other imports

export default function Home() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'RESIZABLE_COMPONENT_MOUNTED' && iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        const initResize = (direction) => (e) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          iframe.contentWindow.postMessage({ type: 'INIT_RESIZE', direction, startX, startY }, '*');
        };

        const resizeHandles = iframeDocument.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => {
          if (handle.classList.contains('right')) {
            handle.addEventListener('mousedown', initResize('horizontal'));
          } else if (handle.classList.contains('bottom')) {
            handle.addEventListener('mousedown', initResize('vertical'));
          } else if (handle.classList.contains('corner')) {
            handle.addEventListener('mousedown', initResize('both'));
          }
        });
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <section className="w-full min-h-screen flex flex-col">
      <Editor
        resolver={{
          ResizableComponent,
          // ... other components
        }}
      >
        <div className="flex flex-1 relative overflow-hidden">
          <ReactIframe
            ref={iframeRef}
            title="my frame"
            className="p-4 w-full h-full page-container"
          >
            <Frame>
              <Element is={ResizableComponent} canvas>
                {/* Your content here */}
              </Element>
            </Frame>
          </ReactIframe>
        </div>
      </Editor>
    </section>
  );
}