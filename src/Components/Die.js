export default function Die(props) {
	return (
		<div
			className={`die ${props.isHeld ? 'held' : ''}`}
			onClick={() => props.holdDice(props.id)}
		>
			{props.value}
		</div>
	);
}
