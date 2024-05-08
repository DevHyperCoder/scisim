<script lang="ts">
	import { sims } from '$lib/sims';
</script>

<main>
	<h1 class="">SciSim</h1>
	<p>This is a collection of a few simulations I made</p>

	{#each sims as sim}
		<div>
			<h3>{sim.name}</h3>
			<p>{sim.description}</p>
			<a href="/sim/{sim.id}">See simulation</a>
		</div>
	{/each}
</main>

<style>
	h1 {
		@apply text-center font-bold text-2xl;
	}
</style>
