<script lang="ts">
	import {
		Chart,
		CategoryScale,
		LinearScale,
		LineElement,
		LineController,
		PointElement,
		Colors,
		Tooltip,
		Legend,
		type ChartData
	} from 'chart.js';
	import { onMount } from 'svelte';

	export let data: ChartData<'line'> = { labels: [], datasets: [] };
	export let xlabel: string;
	export let ylabel: string;

	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;
	let ready = false;

	onMount(() => {
		Chart.register(
			Tooltip,
			Legend,
			Colors,
			LineElement,
			LineController,
			LinearScale,
			CategoryScale,
			PointElement
		);

		chart = new Chart(chartCanvas, {
			type: 'line',
			data,
			options: {
				animation: false,
				elements: {
					point: {
						pointStyle: false
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: xlabel
						}
					},
					y: {
						title: {
							display: true,
							text: ylabel
						}
					}
				}
			}
		});
		ready = true;
	});

	$: {
		data;
		if (ready) {
			chart.data = data;
			chart.update();
		}
	}
</script>

<canvas bind:this={chartCanvas}></canvas>
