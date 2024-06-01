export default function draw(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	sim_m1: number,
	sim_m2: number
) {
	const padding = width * 0.1;
	const massRectW = width * 0.15;
	const massRectH = width * 0.15;

	const theme = {
		pulley: 'red',
		mass: 'red',
		rope: 'green'
	};

	const pullyRad = width * 0.15;

	const top0 = padding + 2 * pullyRad;
	const top100 = height - padding - massRectH;

	const posTotal = sim_m1 + sim_m2;
	const mass1YPerc = sim_m1 / posTotal;
	const mass2YPerc = sim_m2 / posTotal;

	const m1X = width / 2 - pullyRad - massRectW / 2;
	const m1Y = top0 + (top100 - top0) * mass1YPerc;

	const m2X = width / 2 + pullyRad - massRectW / 2;
	const m2Y = top0 + (top100 - top0) * mass2YPerc;

	// Clearing BG
	ctx.fillRect(0, 0, width, height);

	// Drawing pulley
	ctx.beginPath();
	ctx.arc(width / 2, padding + pullyRad, pullyRad, 0, 2 * Math.PI);
	ctx.strokeStyle = theme.pulley;
	ctx.stroke();

	// Drawing masses
	ctx.strokeStyle = theme.mass;
	ctx.strokeRect(m1X, m1Y, massRectW, massRectH);
	ctx.strokeRect(m2X, m2Y, massRectW, massRectH);

	// Drawing 2 ropes
	ctx.beginPath();
	ctx.moveTo(m1X + massRectW / 2, m1Y);
	ctx.lineTo(m1X + massRectW / 2, padding + pullyRad);
	ctx.moveTo(m2X + massRectW / 2, m2Y);
	ctx.lineTo(m2X + massRectW / 2, padding + pullyRad);
	ctx.strokeStyle = theme.rope;
	ctx.stroke();
}
