import { withinContext, drawTwoArrowsAtAngle } from '$lib';

export default function draw(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	surfaceAngleRad: number,
	incidentWithNormalRad: number,
	r: number,
	n1: number,
	n2: number
) {
	context.translate(width / 2, height / 2);
	context.rotate(-surfaceAngleRad);

	// Coloured mediums
	context.fillStyle = n1 > n2 ? 'pink' : 'lightblue';
	context.fillRect(-width, -height, width * 2, height);
	context.fillStyle = n2 > n1 ? 'pink' : 'lightblue';
	context.fillRect(-width, 0, width * 2, height);

	// Drawing refraction surface
	context.lineWidth = 3;
	context.strokeStyle = 'red';

	context.beginPath();
	context.moveTo(-width, 0);
	context.lineTo(width, 0);
	context.stroke();

	// Drawing incident
	withinContext(context, (context) => {
		context.rotate(-incidentWithNormalRad - Math.PI / 2);

		context.lineWidth = 2;
		context.strokeStyle = 'yellow';

		const perc = 0.5;
		const x = (width / 2) * perc;
		const y = 0;
		const angle = Math.PI / 6;
		const ll = 15;

		drawTwoArrowsAtAngle(context, x, y, angle, ll);

		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(width, 0);
		context.stroke();

		context.setLineDash([5, 3]);
		context.moveTo(0, 0);
		context.lineTo(-width, 0);
		context.stroke();
	});

	// Drawing refracted
	withinContext(context, (context) => {
		context.rotate(Math.PI / 2 - r);

		context.lineWidth = 2;
		context.strokeStyle = 'blue';

		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(width, 0);
		context.stroke();

		const perc = 0.5;

		const x = (width / 2) * perc;
		const y = 0;
		const angle = Math.PI - Math.PI / 6;
		const ll = 15;

		drawTwoArrowsAtAngle(context, x, y, angle, ll);
	});

	// Drawing Normal
	withinContext(context, (context) => {
		context.rotate(-Math.PI / 2);

		context.lineWidth = r === 0 ? 3 : 2;
		context.strokeStyle = 'green';

		context.beginPath();
		context.beginPath();
		context.moveTo(-width, 0);
		context.lineTo(width, 0);
		context.stroke();
	});

	context.setTransform(1, 0, 0, 1, 0, 0);
}
