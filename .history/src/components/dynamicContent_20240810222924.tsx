import { useNode } from '@craftjs/core'

// DynamicContent component
export const DynamicContent = ({ children }) => {
	const {
		connectors: { connect, drag }
	} = useNode()

  // Create a ref to hold the DOM element
  const ref = React.useRef<HTMLDivElement>(null);

  // Use useEffect to apply the connect and drag functions
  React.useEffect(() => {
    if (ref.current) {
      (connect as ConnectorElementWrapper)(drag(ref.current));
    }
  }, [connect, drag]);

	return (
		<div
    ref={ref}
    // className="bg-yellow-100 p-4 min-h-[100px] m-2 border border-dashed border-yellow-300"
		>
			<h3 className="text-lg font-bold mb-2 border border-blue-400">Dynamic Content Container</h3>
			{children}
		</div>
	)
}

DynamicContent.craft = {
	displayName: 'Dynamic Content'
}
