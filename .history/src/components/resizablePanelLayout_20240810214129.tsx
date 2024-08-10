// import React, { useId } from 'react';
// import { useNode } from '@craftjs/core';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

// export const ResizablePanelLayout = ({ children, direction = 'horizontal' }) => {
//   const { connectors: { connect, drag } } = useNode();
//   const groupId = useId(); // Generate a unique ID for each PanelGroup

//   const childrenArray = React.Children.toArray(children);

//   return (
//     <div ref={ref => connect(drag(ref))}>
//       <PanelGroup direction={direction} id={groupId}>
//         {childrenArray.map((child, index) => (
//           <React.Fragment key={index}>
//             <Panel>
//               {child}
//             </Panel>
//             {index < childrenArray.length - 1 && <PanelResizeHandle />}
//           </React.Fragment>
//         ))}
//       </PanelGroup>
//     </div>
//   );
// };

// ResizablePanelLayout.craft = {
//   props: {
//     direction: 'horizontal',
//   },
//   related: {
//     toolbar: () => {
//       const { actions, direction } = useNode((node) => ({
//         direction: node.data.props.direction,
//       }));

//       return (
//         <div>
//           <label>
//             Direction:
//             <select
//               value={direction}
//               onChange={(e) => actions.setProp((props) => (props.direction = e.target.value))}
//             >
//               <option value="horizontal">Horizontal</option>
//               <option value="vertical">Vertical</option>
//             </select>
//           </label>
//         </div>
//       );
//     },
//   },
// };