<svelte:head>
	<title>Tecnoesis 2026</title>
</svelte:head>

<div class="coming-soon">
	<div class="scene">
		<!-- Background -->
		<img src="/coming-soon/D02/background.png" alt="" class="scene-layer background" />

		<!-- Blur -->
		<img src="/coming-soon/D02/blur layer.png" alt="" class="scene-layer blur" />

		<!-- Main visual layers -->
		<!-- <img src="/coming-soon/D02/layer-4.png" alt="" class="scene-layer layer-4" /> -->

		<img src="/coming-soon/D02/layer-3.png" alt="" class="scene-layer layer-3" />

		<img src="/coming-soon/D02/layer-2.png" alt="" class="scene-layer layer-2" />

		<!-- Rectangles -->
		<!-- <img src="/coming-soon/D02/Rectangle 62.png" alt="" class="scene-layer rectangle-62" /> -->

		<img src="/coming-soon/D02/Rectangle 63.png" alt="" class="scene-layer rectangle-63" />

		<!-- Astronaut + Tecnoesis logo -->
		<img src="/coming-soon/D02/layer-1.png" alt="" class="scene-layer layer-1" />

		<!-- Decorations -->
		<img src="/coming-soon/D02/decor.png" alt="" class="scene-layer decor" />

		<!-- OFF button -->
		<img src="/coming-soon/D02/button.png" alt="Toggle" class="button" />
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
		background: linear-gradient(
			180deg,
			#09062d 0%,
			#16083f 28%,
			#3b116d 54%,
			#7b1d9c 77%,
			#c347d1 100%
		);
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

	.scene-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: fill;
		display: block;
		pointer-events: none;
		user-select: none;
	}

	.background {
		z-index: 1;
	}

	.blur {
		z-index: 2;
	}

	.layer-4 {
		z-index: 3;
	}

	.layer-3 {
		z-index: 4;
	}

	.layer-2 {
		z-index: 5;
	}

	.rectangle-62 {
		z-index: 6;
	}

	.rectangle-63 {
		z-index: 7;
	}

	.layer-1 {
		z-index: 8;
	}

	.decor {
		position: absolute;
		left: 8.125%;
		top: 10.22%;
		width: 86.495%;
		height: auto;
		display: block;
		z-index: 9;
		pointer-events: none;
		user-select: none;
	}

	.button {
		position: absolute;
		left: 2.2%;
		bottom: 2%;
		width: 5%;
		height: auto;
		z-index: 20;
	}
</style>
