// import React, { useEffect, useState } from 'react'
// import { useNode, useEditor } from '@craftjs/core'
// import { NodeButton } from '@/components/node/button'
// import { ResizableComponent } from '@/components/resizableComponent'

// const NewContent = () => {
//   const {
//     connectors: { connect, drag },
//   } = useNode()

//   return (
//     <div ref={(ref) => connect(drag(ref))}>
//       <ResizableComponent width="20%" height="20%">
//         Hi
//       </ResizableComponent>
//     </div>
//   )
// }

// NewContent.craft = {
//   displayName: 'New Content',
// }
// export const DynamicContent = () => {
//   const {
//     connectors: { connect, drag },
//     id
//   } = useNode()
//   const { actions, query } = useEditor()
//   const [showNewContent, setShowNewContent] = useState(false)

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowNewContent(true)
//       actions.setProp(id, (props) => {
//         props.showNewContent = true
//       })
//       console.log('Dynamic content updated')
//     }, 2000)

//     return () => clearTimeout(timer)
//   }, [id, actions])

//   return (
//     <div
//       ref={(ref) => connect(drag(ref))}
//       className="bg-yellow-100 p-2 m-2 rounded"
//     >
//       {showNewContent ? <NewContent /> : 'Initial Content'}
//     </div>
//   )
// }

// DynamicContent.craft = {
//   displayName: 'Dynamic Content',
//   props: { showNewContent: false },
//   rules: {
//     canDrag: () => true,
//   },
// }


import React, { useEffect } from 'react';
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core';

// DynamicContent component
const DynamicContent = () => {
  const { connectors: { connect, drag } } = useNode();
  const { query } = useEditor();

  
  return (
    <div 
      ref={(ref) => connect(drag(ref))}
      style={{ padding: '10px', margin: '10px', border: '1px solid black' }}
    >
      {query.getNodes()['ROOT'].data.props.content}
    </div>
  );
};

DynamicContent.craft = {
  displayName: 'Dynamic Content',
};

// App component
const App = () => {
  const { actions } = useEditor();

  useEffect(() => {
    const timer = setTimeout(() => {
      actions.deserialize({
        ROOT: {
          type: { resolvedName: 'DynamicContent' },
          isCanvas: true,
          props: { content: 'New Content' },
        },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [actions]);

  return (
    <div>
      <h1>Dynamic Content Demo</h1>
      <Editor resolver={{ DynamicContent }}>
        <Frame data={{
          ROOT: {
            type: { resolvedName: 'DynamicContent' },
            isCanvas: true,
            props: { content: 'Initial Content' },
          },
        }}>
          <Element is={DynamicContent} canvas />
        </Frame>
      </Editor>
    </div>
  );
};

export default App;