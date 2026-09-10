<svelte:head>
	<title>Tecnoesis 2026</title>
</svelte:head>

<div class="coming-soon">
	<div class="scene">
		<img
			src="/coming-soon/D01/background.png"
			alt=""
			class="scene-layer background"
		/>
		<img
			src="/coming-soon/D01/blur layer.png"
			alt=""
			class="scene-layer blur"
		/>
		<img
			src="/coming-soon/D01/layer-4.png"
			alt=""
			class="scene-layer layer-4"
		/>

		<img
			src="/coming-soon/D01/layer-3.png"
			alt=""
			class="scene-layer layer-3"
		/>

		<img
			src="/coming-soon/D01/layer-2.png"
			alt=""
			class="scene-layer layer-2"
		/>

		<img
			src="/coming-soon/D01/Rectangle 62.png"
			alt=""
			class="scene-layer rectangle-62"
		/>

		<img
			src="/coming-soon/D01/Rectangle 63.png"
			alt=""
			class="scene-layer rectangle-63"
		/>

		<img
			src="/coming-soon/D01/layer-1.png"
			alt=""
			class="scene-layer layer-1"
		/>

		<img
			src="/coming-soon/D01/decor.png"
			alt=""
			class="decor"
		/>
		<img
			src="/coming-soon/D01/button.png"
			alt="Toggle"
			class="button"
		/>

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