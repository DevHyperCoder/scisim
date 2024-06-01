import type { Vector } from '$lib/Vector';
import type { SimResult } from '$lib/types';

export type ProjectileSimResult = SimResult<{
	bodyPos: Vector;
	bodyVel: Vector;
}>;
