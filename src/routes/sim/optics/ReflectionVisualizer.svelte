<script lang="ts">
	import { onMount } from 'svelte';
	import NumField from '$components/NumField.svelte';
	import FullWidthCanvas from '$components/FullWidthCanvas.svelte';
	import reflectionDraw from '$lib/sims/optics/reflection/draw';

	let surfaceAngleDegrees: number;
	$: surfaceAngleRad = (surfaceAngleDegrees * Math.PI) / 180;

	let ia_apply: 'surface' | 'normal' = 'normal';

	let incidentAngleDegrees: number;

	$: incidentWithNormalDegrees =
		ia_apply === 'normal' ? incidentAngleDegrees : 90 - incidentAngleDegrees;
	$: incidentWithNormalRad = (incidentWithNormalDegrees * Math.PI) / 180;

	$: draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
		reflectionDraw(context, width, height, surfaceAngleRad, incidentWithNormalRad);
	};

	onMount(() => {
		surfaceAngleDegrees = 0;
		incidentAngleDegrees = 0;
	});
</script>

<section>
	<h2>Reflection</h2>

	<hr />
	<h2>Inputs</h2>

	<div class="input-cluster">
		<NumField id="surface-angle" placeholder="angle of the surface" bind:value={surfaceAngleDegrees}
			>Surface angle</NumField
		>
		<NumField
			id="incident-angle"
			min={-90}
			max={90}
			placeholder="angle of the incident ray to the normal"
			bind:value={incidentAngleDegrees}>Incident angle</NumField
		>

		<label for="u_apply">For</label>
		<div id="ia_apply" role="radiogroup">
			<label for="ia_surface">Surface</label>
			<input id="ia_surface" type="radio" bind:group={ia_apply} value="surface" />
			<label class="ml-3" for="ia_normal">Normal</label>
			<input id="ia_normal" type="radio" bind:group={ia_apply} value="normal" />
		</div>
	</div>

	<hr />

	<h2>Visualisation</h2>
	<div class="lg:grid lg:grid-cols-2 gap-3">
		<FullWidthCanvas {draw} />
		<div>
			<p>Legend:</p>
			<ul>
				<li><span class="bg-[red]"></span> Reflecting Surface</li>
				<li><span class="bg-[green]"></span> Normal</li>
				<li><span class="bg-[yellow]"></span> Incident Ray</li>
				<li><span class="bg-[blue]"></span> Reflecting Ray</li>
			</ul>
		</div>
	</div>
</section>

<style>
	li {
		@apply flex gap-2 mt-1 mb-1;
	}
	span {
		@apply h-4 w-4 block;
	}
</style>
