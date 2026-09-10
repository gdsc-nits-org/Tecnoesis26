<script>
	let scene;

	function handlePointerMove(event) {
		if (!scene) return;

		const bounds = scene.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width - 0.5;
		const y = (event.clientY - bounds.top) / bounds.height - 0.5;

		scene.style.setProperty('--parallax-x', `${x * 16}px`);
		scene.style.setProperty('--parallax-y', `${y * 12}px`);
	}

	function resetParallax() {
		if (!scene) return;

		scene.style.setProperty('--parallax-x', '0px');
		scene.style.setProperty('--parallax-y', '0px');
	}
</script>

<svelte:head>
	<title>Tecnoesis 2026</title>
</svelte:head>

<div class="coming-soon">
	<div
		class="scene"
		bind:this={scene}
		on:pointermove={handlePointerMove}
		on:pointerleave={resetParallax}
	>
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

		<img src="/coming-soon/D01/decor.png" alt="" class="decor decor-a" />
		<img src="/coming-soon/D01/decor.png" alt="" class="decor decor-b" />
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
		width: max(100vw, 160dvh);
		aspect-ratio: 1440 / 900;
		overflow: hidden;
		--parallax-x: 0px;
		--parallax-y: 0px;
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
		transform: translate3d(var(--parallax-x), var(--parallax-y), 0);
		transition: transform 180ms ease-out;
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
		will-change: transform;
	}

	.decor-a {
		animation: diagonal-fall 18s linear infinite;
	}

	.decor-b {
		animation: diagonal-fall 18s linear infinite;
		animation-delay: -9s;
	}

	@keyframes diagonal-fall {
		from {
			transform: translate3d(-7%, -12%, 0) rotate(-2deg);
		}
		to {
			transform: translate3d(7%, 12%, 0) rotate(2deg);
		}
	}

	.button {
		position: absolute;
		left: 2.2%;
		bottom: 2%;
		width: 5%;
		height: auto;
		z-index: 20;
	}

	@media (max-width: 600px) {
		.coming-soon {
			align-items: stretch;
		}

		.scene {
			width: 100vw;
			height: 100dvh;
			aspect-ratio: auto;
		}

		.scene-layer {
			object-fit: cover;
			object-position: 35% center;
		}

		.decor {
			left: 0;
			width: 100%;
		}

		.button {
			left: 4%;
			bottom: 3%;
			width: 12%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.layer-1,
		.decor-a,
		.decor-b {
			animation: none;
			transition: none;
		}
	}
</style>