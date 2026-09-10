<script>
	const layers = [
		'/coming-soon/D03/layer-4.png',
		'/coming-soon/D03/layer-3.png',
		'/coming-soon/D03/layer-2.png',
		'/coming-soon/D03/layer-1.png'
	];
</script>

<svelte:head>
	<title>Tecnoesis 2026</title>
</svelte:head>

<div class="coming-soon">
	<div class="scene">
		<!-- Background -->
		<div class="background"></div>

		<!-- Figma visual layers -->
		{#each layers as layer}
			<img src={layer} alt="" class="layer" />
		{/each}

		<!-- Button -->
		<img src="/coming-soon/D03/button.png" alt="Toggle" class="button" />

		<!-- Decorations -->
		<img src="/coming-soon/D03/decor.png" alt="" class="decor" />
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	:global(body) {
		background: #0c0b3f;
	}

	.coming-soon {
		width: 100vw;
		height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.scene {
		position: relative;
		width: min(100vw, 160dvh);
		aspect-ratio: 1440 / 900;
		overflow: hidden;
	}

	.background {
		position: absolute;
		inset: 0;
		background-image: url('/coming-soon/D03/background.png');
		background-size: 100% 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	.layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		object-fit: fill;
		pointer-events: none;
		user-select: none;
	}

	.button {
		position: absolute;
		left: 2.2%;
		bottom: 2%;
		width: 5%;
		height: auto;
	}

	.decor {
		position: absolute;
		top: 10.22%;
		left: 8.125%;
		width: 86.495%;
		height: auto;
		pointer-events: none;
		user-select: none;
	}
</style>
