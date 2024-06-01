import type { ChartData } from 'chart.js';
import type { ProjectileSimResult } from '.';

type Graphs = 'v-t';
const graphs: Record<Graphs, (simResults: ProjectileSimResult[]) => ChartData<'line'>> = {
	'v-t': (simResults: ProjectileSimResult[]) => {
		return {
			labels: simResults.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'v',
					data: simResults.map((row) => row.value.bodyVel.len())
				},
				{
					label: 'v_x',
					data: simResults.map((row) => row.value.bodyVel.x)
				},
				{
					label: 'v_y',
					data: simResults.map((row) => row.value.bodyVel.y)
				}
			]
		};
	}
};

export default graphs;
