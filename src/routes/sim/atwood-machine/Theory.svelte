<script lang="ts">
	import { display, math } from 'mathlifier';
	export let m1: number;
	export let m2: number;
	export let g: number;
	export let tension: number;
	export let a: number;
</script>

<p>
	A Atwood Machine consists of 2 masses connected through a rope that passes over a pulley. Each
	mass has 2 forces acting on it - the force of gravity and the <a
		href="https://en.wikipedia.org/wiki/Tension_(physics)">tension</a
	>
	of the string. These 2 forces act on the opposite direction, gravity tries to pull the mass down, the
	tension force always tries to pull the mass up (remember: tension doesn't push)
</p>

<br />
<p>
	Since a massless and inextensible string is assumed, the tension at all points on the rope remains
	constant. Also, since the length of the string will be constant, both the masses will have equal
	and opposite acceleration and velocity at all points.
</p>
<br />

<p>
	Lets assume the acceleration for {@html math('m_1')} is downwards, then the acceleration for
	{@html math('m_2')} will be upwards. The equations of motion will be:

	{@html display(
		`m_1a = m_1g - T  \\qquad \\qquad ${m1} \\cdot a = ${m1} \\cdot ${g} - T\\newline

m_2a = T - m_2g \\qquad \\qquad ${m2} \\cdot a = T - ${m2}\\cdot ${g}`,
		{ strict: false }
	)}

	Solving for T,

	{@html display(
		`T = \\frac{2 m_1 m_2 g}{m_1 + m_2} \\qquad \\qquad T = \\frac{2 \\cdot ${m1} \\cdot ${m2} \\cdot ${g}}{${m1} + ${m2}} = ${tension.toPrecision(4)}N`
	)}
	Using {@html math(`T`)} in the equation for {@html math(`m_1`)},

	{@html display(
		`a = \\frac{m_1 g - T}{m_1} \\qquad \\qquad a = \\frac{${m1}\\cdot ${g} - ${tension.toPrecision(4)}}{${m1}} = ${a.toPrecision(4)}m/s^2`
	)}
</p>
<br />
<p>
	If {@html math(`a = 0`)}, the system may be at rest or moving with constant velocity (if the
	initial velocity {@html math(`u \\ne 0`)} )
</p>
