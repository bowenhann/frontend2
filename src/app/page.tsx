"use client"
import React, { useEffect, useState } from 'react'
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core'
import { renderComponents } from '@/lib/componentRenderer'
import { Canvas } from '@/components/canvas'
import { Wrapper } from '@/components/wrapper'
import { SideMenu } from '@/components/side-menu'
import { ControlPanel } from '@/components/control-panel'
import { Viewport } from '@/components/viewport'
import { componentsMap } from '@/components/node/components-map'
import { DynamicContent } from '@/components/dynamicContent';
import { componentMap } from '@/lib/component-map'
import { componentStrings } from '@/lib/test-string'

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
  displayName: '',
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

  useEffect(() => {
    const addComponent = () => {
      if (stage >= componentStrings.length) {
        console.log('All stages have been added.');
        return;
      }

      console.log('Adding stage:', stage);

      try {
        const currentComponentString = componentStrings[stage];
        console.log("mycomp", currentComponentString)
        const parsedComponents = renderComponents(currentComponentString);
        parsedComponents.forEach((parsedComponent) => {
          console.log("myparse", parsedComponent)
          const craftElement = createCraftElement(parsedComponent);
          console.log("mycraft", craftElement)
          if (craftElement) {
            const nodeTree = query.parseReactElement(craftElement).toNodeTree();
            console.log("mynode", nodeTree)
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

<<<<<<< HEAD
=======
const mystring = `<h3 class="text-lg font-semibold mb-2">Raw HTML Section</h3>
          <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
          </ul>`

>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
// App component
const App = () => {
	return (
		<div className="p-4">
			{/* <h1 className="text-2xl font-bold mb-4">Dynamic Button Rendering Demo</h1> */}
			<Editor
				resolver={{
          ...componentMap,
					TextBox,
					Container,
					NewContent,
					Canvas,
					Wrapper,
				}}
			>
				<div className="flex flex-1 relative overflow-hidden">
					<SideMenu componentsMap={componentsMap} />
					<Viewport>
						<Frame>
							<Element is={Wrapper} canvas>
<<<<<<< HEAD
=======
                {/* <CodeGenerator></CodeGenerator> */}
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
								<Element is={DynamicContent}>{null}</Element>
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