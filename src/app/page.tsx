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

NewContent.craft = {
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
      ref={(ref) => connect(drag(ref)) as any}
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
    ref={(ref) => connect(drag(ref)) as any}
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
  const { actions, query } = useEditor();
  const [stage, setStage] = useState(0);

  const componentStrings1 = [
    `<ResizableComponent width='100%' height='10%'> <NodeHeader className='bg-gray-800 text-white py-4'> <NodeLogo className='text-xl font-bold'>My Website</NodeLogo> <NodeMenu className='flex'> <NodeMenuItem className='ml-6'>Home</NodeMenuItem> <NodeMenuItem className='ml-6'>About</NodeMenuItem> <NodeMenuItem className='ml-6'>Services</NodeMenuItem> <NodeMenuItem className='ml-6'>Contact</NodeMenuItem> </NodeMenu> </NodeHeader> </ResizableComponent>`,
    `<ResizableComponent width='100%' height='50%'> <NodeHero className='bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center'> <NodeHeroHeading className='text-4xl font-bold text-white'>Welcome to My Website</NodeHeroHeading> <NodeButton className='bg-white text-purple-500 px-6 py-3 rounded-full mt-8'>Get Started</NodeButton> </NodeHero> </ResizableComponent>`,
    `<ResizableComponent width='100%' height='40%' className='flex'> <NodeContent className='w-3/4'> <NodeCard className='flex bg-white shadow-lg rounded-lg overflow-hidden my-4'> <NodeCardImage src='https://example.com/card-image-1.jpg' alt='Card Image 1' className='w-1/3' /> <div className='p-4'> <NodeCardTitle className='text-xl font-bold'>Card Title 1</NodeCardTitle> <NodeCardDescription>This is a description of the first card.</NodeCardDescription> <NodeButton className='bg-purple-500 text-white px-4 py-2 rounded mt-4'>Learn More</NodeButton> </div> </NodeCard> </NodeContent> </ResizableComponent>`
  ];

  const componentStrings = [
   ` <ResizableComponent width="100%" height="100%" className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
  <NodeCard className="bg-white rounded-lg shadow-lg overflow-hidden">
    <NodeCardHeader className="bg-gradient-to-r from-blue-400 to-indigo-500 p-4">
      <NodeCardTitle className="text-2xl font-bold text-white">Complex Component Demo</NodeCardTitle>
      <NodeCardDescription className="text-sm text-blue-100">Showcasing various nested components</NodeCardDescription>
    </NodeCardHeader>
    <NodeCardContent className="p-6">
      <NodeAccordion type="single" collapsible>
        <NodeAccordion.Item value="item-1">
          <NodeAccordion.Trigger>Interactive Elements</NodeAccordion.Trigger>
          <NodeAccordion.Content>
            <div className="space-y-4">
              <NodeButton className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-md hover:from-green-500 hover:to-blue-600 transition-all duration-300">
                Gradient Button
              </NodeButton>
              <NodeCheckbox label="Check me!" className="text-indigo-600" />
              <NodeInput placeholder="Type something..." className="border-2 border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
          </NodeAccordion.Content>
        </NodeAccordion.Item>
        <NodeAccordion.Item value="item-2">
          <NodeAccordion.Trigger>Visual Elements</NodeAccordion.Trigger>
          <NodeAccordion.Content>
            <div className="space-y-4">
              <NodeAvatar src="https://example.com/avatar.jpg" alt="User Avatar" className="w-16 h-16 rounded-full border-4 border-gradient-to-r from-yellow-400 to-orange-500" />
              <NodeBadge variant="outline" className="bg-gradient-to-r from-teal-400 to-blue-500 text-white">
                Premium User
              </NodeBadge>
              <NodeAlert variant="info" className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                <NodeAlertTitle>Info</NodeAlertTitle>
                <NodeAlertDescription>This is an informational alert with a gradient background.</NodeAlertDescription>
              </NodeAlert>
            </div>
          </NodeAccordion.Content>
        </NodeAccordion.Item>
      </NodeAccordion>
      
      <NodeCollapsible className="mt-6 border border-gray-200 rounded-md">
        <NodeCollapsible.Trigger className="w-full p-4 text-left font-medium bg-gradient-to-r from-gray-50 to-gray-100">
          Toggle Calendar
        </NodeCollapsible.Trigger>
        <NodeCollapsible.Content className="p-4">
          <NodeCalendar className="bg-white shadow-md rounded-lg" />
        </NodeCollapsible.Content>
      </NodeCollapsible>
      
      <NodeAspectRatio ratio={16 / 9} className="mt-6">
        <div className="w-full h-full bg-gradient-to-tl from-purple-400 via-pink-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
          16:9 Aspect Ratio Container
        </div>
      </NodeAspectRatio>
    </NodeCardContent>
    <NodeCardFooter className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 flex justify-between items-center">
      <NodeHoverCard>
        <NodeHoverCard.Trigger>
          <NodeButton variant="outline" className="text-gray-700 hover:text-gray-900">
            Hover for more info
          </NodeButton>
        </NodeHoverCard.Trigger>
        <NodeHoverCard.Content className="bg-white p-4 rounded-md shadow-lg">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <p className="text-sm text-gray-600">This complex component demonstrates various nested elements and gradient styles.</p>
        </NodeHoverCard.Content>
      </NodeHoverCard>
      <NodeDialog>
        <NodeDialog.Trigger asChild>
          <NodeButton className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300">
            Open Dialog
          </NodeButton>
        </NodeDialog.Trigger>
        <NodeDialog.Content className="bg-white rounded-lg shadow-xl p-6">
          <NodeDialog.Header>
            <NodeDialog.Title className="text-2xl font-bold text-gray-900">Dialog Title</NodeDialog.Title>
            <NodeDialog.Description className="text-sm text-gray-500">
              This is a description of the dialog content.
            </NodeDialog.Description>
          </NodeDialog.Header>
          <div className="mt-4">
            <p className="text-gray-700">Dialog content goes here...</p>
          </div>
          <NodeDialog.Footer className="mt-6 flex justify-end">
            <NodeDialog.Close asChild>
              <NodeButton variant="outline" className="mr-2">Cancel</NodeButton>
            </NodeDialog.Close>
            <NodeButton className="bg-blue-500 text-white">Confirm</NodeButton>
          </NodeDialog.Footer>
        </NodeDialog.Content>
      </NodeDialog>
    </NodeCardFooter>
  </NodeCard>
</ResizableComponent>
`
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

        setStage(prevStage => prevStage + 1);
      } catch (error) {
        console.error('Error updating content:', error);
      }
    };

    // Only add the component if we haven't reached the end
    if (stage < componentStrings.length) {
      const timer = setTimeout(addComponent, 1000); // Increased delay to 1 second
      return () => clearTimeout(timer);
    }
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
								<Element is={DynamicContent}>Temporary</Element>
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