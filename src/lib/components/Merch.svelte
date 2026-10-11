<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene3d from './Scene3d.svelte';
	import MerchText from './MerchText.svelte';

	let dragRotationX = $state(0);
	let dragRotationY = $state(0);
	let activePointerId: number | null = null;

	function startDrag(event: PointerEvent) {
		if (event.pointerType !== 'mouse' || event.button !== 0) return;
		if (!(event.currentTarget instanceof HTMLElement)) return;
		activePointerId = event.pointerId;
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function dragModel(event: PointerEvent) {
		if (event.pointerType !== 'mouse' || event.pointerId !== activePointerId) return;
		dragRotationX += event.movementY * 0.008;
		dragRotationY += event.movementX * 0.008;
	}

	function endDrag(event: PointerEvent) {
		if (event.pointerId === activePointerId) activePointerId = null;
	}
</script>

<main
	class="flex min-h-[100svh] min-h-screen w-full flex-col items-center justify-center gap-4 px-4 py-6 sm:px-6 md:flex-row md:gap-0 md:px-8"
>
	<div
		class="merch-stage relative flex aspect-square w-full max-w-[min(74svh,100%)] shrink-0 items-center justify-center md:w-[min(54vw,78svh)] md:max-w-[54vw]"
		role="group"
		aria-label="3D merchandise model. Drag with the mouse to rotate."
		onpointerdown={startDrag}
		onpointermove={dragModel}
		onpointerup={endDrag}
		onpointercancel={endDrag}
	>
		<div class="merch-glow" aria-hidden="true"></div>
		<div class="relative z-[1] h-full w-full">
			<Canvas>
				<Scene3d {dragRotationX} {dragRotationY} />
			</Canvas>
		</div>
	</div>

	<MerchText />
</main>

<style>
	.merch-stage {
		isolation: isolate;
		cursor: grab;
		touch-action: pan-y;
	}

	.merch-stage:active {
		cursor: grabbing;
	}

	.merch-glow {
		position: absolute;
		z-index: 0;
		width: min(100%, 80rem);
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(235, 167, 255, 0.68) 0%,
			rgba(177, 72, 255, 0.38) 28%,
			rgba(95, 36, 209, 0.18) 52%,
			transparent 74%
		);
		filter: blur(26px);
		opacity: 0.82;
		pointer-events: none;
		animation: merch-glow-pulse 4.5s ease-in-out infinite;
	}

	@keyframes merch-glow-pulse {
		0%,
		100% {
			transform: scale(0.92);
			opacity: 0.68;
		}
		50% {
			transform: scale(1.04);
			opacity: 0.92;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.merch-glow {
			animation: none;
		}
	}
</style>
