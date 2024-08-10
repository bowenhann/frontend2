"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core'
import { NodeButton } from '@/components/node/button'
import { ResizableComponent } from '@/components/resizableComponent'
import { renderComponents } from '@/lib/componentRenderer'
import { Canvas } from '@/components/canvas'
import { Wrapper } from '@/components/wrapper'
import {
	NodeCardHeader,
	NodeCard,
	NodeCardContent,
	NodeCardDescription,
	NodeCardTitle,
	NodeCardFooter
} from '@/components/node/card'
import { SideMenu } from '@/components/side-menu'
import { ControlPanel } from '@/components/control-panel'
import { Viewport } from '@/components/viewport'
import { componentsMap } from '@/components/node/components-map'
import { NodeOneBlock, NodeTwoBlocks } from '@/components/node/layout'
import { NodeAccordion } from '@/components/node/accordion'
import { NodeAvatar } from '@/components/node/avatar'
import { NodeAlert } from '@/components/node/alert'
import { NodeAspectRatio } from '@/components/node/aspect-ratio'
import { NodeBadge } from '@/components/node/badge'
import { NodeCheckbox } from '@/components/node/checkbox'
import { NodeCollapsible } from '@/components/node/collapsible'
import { NodeCommand } from '@/components/node/command'
import { NodeContextMenu } from '@/components/node/context-menu'
import { NodeDialog } from '@/components/node/dialog'
import { NodeCalendar } from '@/components/node/calendar'
import { NodeAlertDialog } from '@/components/node/alert-dialog'
import { NodeHoverCard } from '@/components/node/hover-card'
import { NodeInput } from '@/components/node/input'
import { DynamicContent } from '@/components/dynamicContent';


// Updated NewContent component

const buttonStrings = [
	`<NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
			Button 1
		</NodeButton>`,
	`<ResizableComponent width="95%" height="10%">
		<div className="bg-gray-800 text-white p-4">
			<h1 className="text-2xl font-bold">My Application</h1>
		</div>
	</ResizableComponent>`,`
	<ResizableComponent width="32%" height="50%">
		<NodeCalendar className="p-4"></NodeCalendar>
	</ResizableComponent>`,`
	<ResizableComponent width="20%" height="50%">
		<NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
			Button 1
		</NodeButton>
	</ResizableComponent>`,
	
	`<ResizableComponent width="20%" height="50%">
		<NodeButton>Button 2</NodeButton>
		<ResizableComponent width="10%" height="10%">
			<NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
				Button 1
			</NodeButton>
		</ResizableComponent>
	</ResizableComponent>`,`
	<ResizableComponent width="20%" height="50%">
		<NodeButton>Button 3</NodeButton>
	</ResizableComponent>`,
	
	`<ResizableComponent width="95%" height="35%">
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
	</ResizableComponent>`
]

interface NewContentProps {
  buttonStrings: string[];
  stage: number;
}

interface CraftComponent<T> extends React.FC<T> {
  craft: {
    displayName: string;
    props: Partial<T>;
    related: {
      toolbar: () => React.ReactElement;
    };
  };
}

const NewContent: CraftComponent<NewContentProps> = ({ buttonStrings, stage }) => {
  const { connectors: { connect, drag } } = useNode();

  const renderContent = () => {
    const combinedString = buttonStrings.slice(stage, stage + 1).join('\n');
    const ButtonComponent = renderComponents(combinedString);
		return (
      <Element 
        id="dynamic_content_container" 
        is={Container} 
        canvas 
        className={`dynamic-class-${stage}`}
      >
        {ButtonComponent}
      </Element>
    );
  };

	return (<div>{renderContent()}</div>);
  // return (
  //   <div
  //     ref={(ref) => connect(drag(ref))}
  //     className="p-2 m-1 border border-dashed border-gray-300"
  //   >
  //     {renderContent()}
  //   </div>
  // );
};

NewContent.cra = {
  displayName: 'Dynamic Content Container',
  props: {
    buttonStrings: [],
    stage: 0
  },
  related: {
    toolbar: () => <div>Custom Toolbar</div>
  }
};


// TextBox component
const TextBox = ({ text, className }) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className={`bg-blue-100 p-2 m-2 border border-dashed border-blue-300 ${className}`}
		>
			{text}
		</div>
	)
}

TextBox.craft = {
	displayName: 'Text Box',
	props: {
		text: 'Draggable Text Box',
		className: ''
	}
}

// Container component
const Container = ({ children, className }) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className={`  min-h-[100px] border border-dashed border-green-300 ${className}`}
		>
			{children}
		</div>
	)
}

Container.craft = {
	displayName: 'Container',
	props: {
		className: ''
	}
}

// Helper function to safely stringify objects
const safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};


// Function to convert string to component configuration
const stringToComponentConfig = (str) => {
  // Remove leading/trailing whitespace and newlines
  str = str.trim();
  
  // Extract the component type
  const typeMatch = str.match(/^<(\w+)/);
  if (!typeMatch) return null;
  const type = typeMatch[1];

  // Extract props
  const propsMatch = str.match(/(\w+)="([^"]*)"/g);
  const props = {};
  if (propsMatch) {
    propsMatch.forEach(prop => {
      const [key, value] = prop.split('=');
      props[key] = value.replace(/"/g, '');
    });
  }

  // Extract children
  const childrenMatch = str.match(/>([^<]+)</);
  if (childrenMatch) {
    props.children = childrenMatch[1].trim();
  }

  // Handle nested components
  const nestedComponentMatch = str.match(/>(.+)</s);
  if (nestedComponentMatch && nestedComponentMatch[1].includes('<')) {
    props.children = renderComponents(nestedComponentMatch[1].trim());
  }

  // Map string type to actual component
  const componentMap = {
    NodeButton,
    ResizableComponent,
    NodeCard,
    NodeCardHeader,
    NodeCardContent,
    NodeCardDescription,
    NodeCardTitle,
    NodeCardFooter,
    NodeCalendar,
    div: 'div'
  };

  return {
    type: componentMap[type] || type,
    props
  };
};
const componentMap = {
  NodeButton,
  ResizableComponent,
  NodeCalendar,
  // Add other components here
};

const createCraftElement = (component) => {
  if (typeof component !== 'object' || component === null) {
    return component;
  }

  const { type, props } = component;
  const Component = componentMap[type] || type;

  if (!Component) {
    console.error(`Component type "${type}" not found in componentMap`);
    return null;
  }

  const craftProps = { ...props };

  if (props && props.children) {
    craftProps.children = Array.isArray(props.children)
      ? props.children.map(createCraftElement)
      : createCraftElement(props.children);
  }

  return (
    <Element canvas is={Component} {...craftProps}>
      {craftProps.children}
    </Element>
  );
};
// Updated ContentUpdater component
const ContentUpdater = () => {
  const { actions, query } = useEditor()
  const [stage, setStage] = useState(0)
  const [newContentNodeId, setNewContentNodeId] = useState(null);

	const componentStrings = [
		// `<NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
		// 		Button 1
		// 	</NodeButton>`,
		// `<ResizableComponent width="95%" height="10%">
		// 	<div className="bg-gray-800 text-white p-4">
		// 		<h1 className="text-2xl font-bold">My Application</h1>
		// 	</div>
		// </ResizableComponent>`,
		`
		<ResizableComponent width="32%" height="50%">
			<NodeCalendar className="p-4"></NodeCalendar>
		</ResizableComponent>`,`
		<ResizableComponent width="20%" height="50%">
			<NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
				Button 1
			</NodeButton>
		</ResizableComponent>
	`,
		
		// `<ResizableComponent width="20%" height="50%">
		// 	<NodeButton>Button 2</NodeButton>
		// 	<ResizableComponent width="10%" height="10%">
		// 		<NodeButton className="bg-red-500 text-white px-4 py-2 rounded">
		// 			Button 1
		// 		</NodeButton>
		// 	</ResizableComponent>
		// </ResizableComponent>`,
		// `
		// <ResizableComponent width="20%" height="50%">
		// 	<NodeButton>Button 3</NodeButton>
		// </ResizableComponent>`,
		
		`<ResizableComponent width="95%" height="35%">
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
		</ResizableComponent>`
	]

	const componentStages = [
    {
      type: NodeButton,
      props: {
        className: "bg-red-500 text-white px-4 py-2 rounded",
        children: "Button 1"
      }
    },
    {
      type: ResizableComponent,
      props: {
        width: "35%",
        height: "10%",
        children: (
          <div className="bg-green-800 text-white p-4">
            <h1 className="text-2xl font-bold">My Application</h1>
          </div>
        )
      }
    },
    {
      type: ResizableComponent,
      props: {
        width: "32%",
        height: "50%",
        children: <NodeCalendar className="p-4" />
				
      }
    },
    // ... add more stages as needed
  ];

  useEffect(() => {
    const addComponent = () => {
      if (stage >= componentStrings.length) {
        console.log('All stages have been added.');
        return;
      }

      console.log('Adding stage:', stage);

      try {
        const currentComponentString = componentStrings[stage];
        const parsedComponents = renderComponents(currentComponentString);

        parsedComponents.forEach((parsedComponent) => {
          const craftElement = createCraftElement(parsedComponent);
          if (craftElement) {
            const nodeTree = query.parseReactElement(craftElement).toNodeTree();
            actions.addNodeTree(nodeTree, 'ROOT');
          }
        });

        setTimeout(() => {
          const updatedRootNode = query.node('ROOT').get();
          console.log('Updated ROOT node structure:', safeStringify(updatedRootNode));
        }, 0);

        setStage(prevStage => prevStage + 1);
      } catch (error) {
        console.error('Error updating content:', error);
        console.error('Error stack:', error.stack);
      }
    };

    const timer = setInterval(addComponent, 100);

    return () => clearInterval(timer);
  }, [actions, query, stage, componentStrings]);

  return null;
};

// App component
const App = () => {
	return (
		<div className="p-4">
			{/* <h1 className="text-2xl font-bold mb-4">Dynamic Button Rendering Demo</h1> */}
			<Editor
				resolver={{
					DynamicContent,
					TextBox,
					Container,
					NewContent,
					NodeButton,
					Canvas,
					ResizableComponent,
					NodeCardHeader,
					NodeCard,
					NodeCardContent,
					NodeCardDescription,
					NodeCardTitle,
					NodeCardFooter,
					Wrapper,
					Element,
					div: 'div',
					span: 'span',
					NodeAccordion,
					NodeAvatar,
					// NodeAlertDialog,
					NodeAlert,
					NodeAspectRatio,
					NodeBadge,
					NodeCheckbox,
					NodeCollapsible,
					NodeCommand,
					NodeContextMenu,
					NodeDialog,
					NodeCalendar,
					NodeAlertDialog,
					NodeHoverCard,
					NodeInput
					// LoadingComponent,
				}}
			>
				<div className="flex flex-1 relative overflow-hidden">
					<SideMenu componentsMap={componentsMap} />
					<Viewport>
						<Frame>
							<Element is={Wrapper} canvas>
								<Element is={DynamicContent}></Element>
							</Element>
						</Frame>
					</Viewport>
					<ControlPanel />
				</div>
				<ContentUpdater />
			</Editor>
		</div>
	)
}

export default App

// export default function Home() {
//   return (
//     <div>
//       <h1>Welcome to my Next.js app</h1>
//     </div>
//   )
// }