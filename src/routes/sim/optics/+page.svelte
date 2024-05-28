<script lang="ts">
	import ReflectionVisualizer from './ReflectionVisualizer.svelte';
	import RefractionVisualizer from './RefractionVisualizer.svelte';
	import SlabVisualizer from './SlabVisualizer.svelte';
</script>

<main>
	<header>
		<h1>Optic simulations</h1>
		<p>Simulations showing some concepts of optics</p>
	</header>

	<ReflectionVisualizer />
	<RefractionVisualizer />
	<SlabVisualizer />
</main>

<style>
	:global(.input-cluster) {
		@apply grid-cols-[16ch_1fr];
	}
</style>
