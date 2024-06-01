import { Vector } from '$lib/Vector';

export default function draw(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	angleRad: number,
	planeLength: number,
	wordBodyPos: Vector
) {
	const padding = width * 0.1;

	context.fillStyle = 'black';
	context.fillRect(0, 0, width, height);

	// Drawing the inclined plane
	const lenOfPlanePx = height - 2 * padding;
	const startingPoint = new Vector(padding, height - padding);
	const endingPoint = new Vector(
		startingPoint.x + lenOfPlanePx * Math.cos(angleRad),
		startingPoint.y - lenOfPlanePx * Math.sin(angleRad)
	);

	context.lineWidth = 2;
	context.strokeStyle = 'red';

	context.beginPath();
	context.moveTo(startingPoint.x, startingPoint.y);
	context.lineTo(endingPoint.x, endingPoint.y);
	context.stroke();

	const gap = 10;
	const origin = endingPoint.sub(
		new Vector(
			gap * Math.sin(angleRad), // cos(90 - angleRad)
			gap * Math.cos(angleRad) // sin(90 - angleRad)
		)
	);

	// Marking origin
	context.strokeStyle = 'blue';
	context.beginPath();
	context.arc(origin.x, origin.y, 1, 0, 2 * Math.PI);
	context.stroke();

	const planeLengthPx = endingPoint.sub(startingPoint).len();
	const simToWorldRatio = planeLengthPx / planeLength;

	const bodyPos = origin.add(wordBodyPos.multiply(simToWorldRatio));

	context.fillStyle = 'lightgreen';
	context.beginPath();
	context.arc(bodyPos.x, bodyPos.y, 10, 0, 2 * Math.PI);
	context.fill();
}
