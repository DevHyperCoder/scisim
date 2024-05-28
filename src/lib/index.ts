export function withinContext(
	context: CanvasRenderingContext2D,
	fn: (ctx: CanvasRenderingContext2D) => void
) {
	context.save();
	fn(context);
	context.restore();
}

export function drawTwoArrowsAtAngle(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	angle: number,
	lineLength: number
) {
	withinContext(context, (context) => {
		context.translate(x, y);
		context.rotate(angle);

		context.lineWidth = 4;
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(lineLength, 0);
		context.stroke();

		context.rotate(-2 * angle);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(lineLength, 0);
		context.stroke();
	});
}

export function calculateR(incidentWithNormalRad: number, n1: number, n2: number) {
	const i_c = Math.asin(n2 / n1);

	if (incidentWithNormalRad > i_c) {
		return Math.PI - incidentWithNormalRad;
	} else if (incidentWithNormalRad == i_c) {
		return Math.PI / 2;
	} else {
		return Math.asin(Math.sin(incidentWithNormalRad) / (n2 / n1));
	}
}
