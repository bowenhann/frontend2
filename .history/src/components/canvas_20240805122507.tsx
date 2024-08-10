// Container component
const Canvas = ({ children, className }) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className={`bg-green-100 p-4 min-h-[100px] m-2 border border-dashed border-green-300 ${className}`}
		>
			{children}
		</div>
	)
}

Canvas.craft = {
	displayName: 'Container',
	props: {
		className: ''
	}
}