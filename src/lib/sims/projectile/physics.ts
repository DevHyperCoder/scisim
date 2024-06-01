import { Vector } from '$lib/Vector';
import type { ProjectileSimResult } from '.';

interface ProjectilePhysicsProps {
	u: number;
	g: number;
	angleRad: number;
}
export default function physics(
	{ angleRad, g, u }: ProjectilePhysicsProps,
	dt = 1 / 1000
): ProjectileSimResult[] {
	let t = 0;

	const pos = Vector.ZERO();
	const v = new Vector(u * Math.cos(angleRad), u * Math.sin(angleRad));
	const a = new Vector(0, -g);

	const data = [];
	data.push({ t, value: { bodyPos: pos.clone(), bodyVel: v.clone() } });

	// eslint-disable-next-line no-constant-condition
	while (true) {
		v.madd(a.multiply(dt));
		pos.madd(v.multiply(dt));
		t += dt;

		if (pos.y <= 0) {
			break;
		}

		data.push({ t, value: { bodyPos: pos.clone(), bodyVel: v.clone() } });
	}

	return data;
}
