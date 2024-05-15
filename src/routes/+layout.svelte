<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

//	onMount(() => {
//		let script = document.createElement('script');
//    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
//    document.head.append(script);
//		
//		script.onload = () => {
//// TODO ignore error
//      MathJax = {
//        tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
//        svg: {fontCache: 'global'}
//      };
//		};
//		console.log("Here")
//	});
</script>

<slot />
