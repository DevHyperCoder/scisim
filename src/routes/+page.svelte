<script lang="ts">
	import SimulationCard from '$components/SimulationCard.svelte';
</script>

<svelte:head><title>SciSim</title></svelte:head>
<main>
	<h1 class="">SciSim</h1>
	<p>This is a collection of a few simulations I made</p>

	<div class="grid grid-cols-1 gap-4">
		<SimulationCard name="Projectile Motion" id="projectile">
			<p>
				Simulation of projectile motion where you can adjust the angle and find out the range, max
				height of the projectile.
			</p>
		</SimulationCard>
		<SimulationCard name="Optics" id="optics">
			<p>
				Simulation of optical phenomenon like reflection, refraction and glass slab lateral shift.
			</p>
		</SimulationCard>
		<SimulationCard name="Atwood Machine" id="atwood-machine">
			<p>
				Simulation of a mass-pulley system where you can adjust the mass (and velocity) of the
				objects and gravity and see how the system responds.
			</p>
		</SimulationCard>

		<SimulationCard name="Inclined Plane" id="inclined-plane">
			<p>
				Simulation of a inclined plane system where you can adjust the mass, angle of the plane and
				apply dynamic friction.
			</p>
		</SimulationCard>
	</div>
</main>

<style>
	h1 {
		@apply text-center font-bold text-2xl;
	}
</style>
