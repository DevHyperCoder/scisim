<script lang="ts">
	import NumField from '$components/NumField.svelte';
	import ReflectionVisualizer from './ReflectionVisualizer.svelte';

	let surfaceAngleDegrees: number = 0;
	$: surfaceAngleRad = (surfaceAngleDegrees * Math.PI) / 180;

	let ia_apply: 'surface' | 'normal' = 'normal';

	let incidentAngleDegrees: number = 0;

	$: incidentWithNormalDegrees =
		ia_apply === 'normal' ? incidentAngleDegrees : 90 - incidentAngleDegrees;
	$: incidentWithSurfaceRad = ((90 - incidentWithNormalDegrees) * Math.PI) / 180;
</script>

<main>
	<header>
		<h1>Optic simulations</h1>
		<p>Simulations showing some concepts of optics</p>
	</header>

	<section>
		<h2>Reflection</h2>

		<hr />
		<h2>Inputs</h2>

		<div class="input-cluster">
			<NumField
				id="surface-angle"
				placeholder="angle of the surface"
				bind:value={surfaceAngleDegrees}>Surface angle</NumField
			>
			<NumField
				id="incident-angle"
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
		<div class="grid grid-cols-2">
			<ReflectionVisualizer {surfaceAngleRad} {incidentWithSurfaceRad} />
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
</main>

<style>
	li {
		@apply flex gap-2 mt-1 mb-1;
	}
	span {
		@apply h-4 w-4 block;
	}
	.input-cluster {
		@apply grid-cols-[16ch_1fr];
	}
</style>
