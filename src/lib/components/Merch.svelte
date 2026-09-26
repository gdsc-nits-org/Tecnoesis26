<script>
	import { Canvas } from "@threlte/core";
	import Scene3d from "./Scene3d.svelte";
	import MerchText from "./MerchText.svelte";

</script>
<svelte:head>
  <title>THE FUTURE — SCROLL</title>
</svelte:head>

<main class="min-h-screen flex flex-col md:flex-row items-center px-6 md:px-16 ">
<div class="w-full md:w-3/5 h-[90vh] flex justify-center">
  <Canvas>
    <Scene3d />
  </Canvas>
</div>

<MerchText />
</main>