import type { Vector } from '$lib/Vector';
import type { SimResult } from '$lib/types';

export type InclinedPlaneSimResult = SimResult<{
	bodyPos: Vector;
	bodyVel: Vector;
}>;
