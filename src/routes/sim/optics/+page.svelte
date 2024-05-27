<script lang="ts">
	import ReflectionVisualizer from './ReflectionVisualizer.svelte';
</script>

<main>
	<header>
		<h1>Optic simulations</h1>
		<p>Simulations showing some concepts of optics</p>
	</header>

	<ReflectionVisualizer />
</main>

<style>
	:global(.input-cluster) {
		@apply grid-cols-[16ch_1fr];
	}
</style>
