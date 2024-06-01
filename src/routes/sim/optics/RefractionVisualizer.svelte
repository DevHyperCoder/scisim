<script lang="ts">
	import { math } from 'mathlifier';
	import { onMount } from 'svelte';
	import NumField from '$components/NumField.svelte';
	import { calculateR } from '$lib';
	import refractionDraw from '$lib/sims/optics/refraction/draw';
	import FullWidthCanvas from '$components/FullWidthCanvas.svelte';

	let ia_apply: 'surface' | 'normal' = 'normal';

	let surfaceAngleDegrees: number;
	$: surfaceAngleRad = (surfaceAngleDegrees * Math.PI) / 180;
	let incidentAngleDegrees: number;

	$: incidentWithNormalDegrees =
		ia_apply === 'normal' ? incidentAngleDegrees : 90 - incidentAngleDegrees;
	$: incidentWithNormalRad = (incidentWithNormalDegrees * Math.PI) / 180;

	$: r = calculateR(incidentWithNormalRad, n1, n2);
	$: rDegrees = (r * 180) / Math.PI;

	let n1: number;
	let n2: number;

	onMount(() => {
		n1 = 1.0;
		n2 = 1.5;
		surfaceAngleDegrees = 0;
		incidentAngleDegrees = 60;
	});

	$: draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
		refractionDraw(context, width, height, surfaceAngleRad, incidentWithNormalRad, r, n1, n2);
	};
</script>

<section>
	<h2>Refraction</h2>

	<hr />
	<h2>Inputs</h2>

	<div class="input-cluster">
		<NumField
			id="surface-angle"
			min={-90}
			max={90}
			placeholder="surface angle"
			bind:value={surfaceAngleDegrees}>Surface angle</NumField
		>

		<NumField
			min={1}
			step={0.1}
			id="n1"
			placeholder="Refractive index of top medium "
			bind:value={n1}>{@html math('\\mu_1')}</NumField
		>
		<NumField
			min={1}
			step={0.1}
			id="n2"
			placeholder="Refractive index of bottom medium "
			bind:value={n2}>{@html math('\\mu_2')}</NumField
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
			{#if incidentAngleDegrees}
				<p>Values:</p>
				{@html math(`\\angle i = ${incidentAngleDegrees.toPrecision(4)} \\degree`)}
				<br />
				{@html math(`\\angle r = ${rDegrees.toPrecision(4)} \\degree`)}
				<br />

				<!-- TIR -->
				{#if n1 > n2}
					{@html math(
						`\\theta_c = ${((Math.asin(n2 / n1) * 180) / Math.PI).toPrecision(4)} \\degree`
					)}
				{/if}
			{/if}
			<hr />

			<p>Legend:</p>
			<ul>
				<li><span class="bg-[red]"></span>Medium interface</li>
				<li><span class="bg-[pink]"></span> Denser Medium</li>
				<li><span class="bg-[lightblue]"></span> Lighter Medium</li>
				<li><span class="bg-[green]"></span> Normal</li>
				<li><span class="bg-[yellow]"></span> Incident Ray</li>
				<li><span class="bg-[blue]"></span> Refracted Ray</li>
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
