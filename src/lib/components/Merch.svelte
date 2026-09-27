<script>
	import { Canvas } from '@threlte/core';
	import Scene3d from './Scene3d.svelte';
	import MerchText from './MerchText.svelte';
</script>

<svelte:head>
	<title>THE FUTURE — SCROLL</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center px-6 md:flex-row md:px-16">
	<div class="merch-stage relative flex h-[90vh] w-full items-center justify-center md:w-3/5">
		<div class="merch-glow" aria-hidden="true"></div>
		<div class="relative z-[1] h-full w-full">
			<Canvas>
				<Scene3d />
			</Canvas>
		</div>
	</div>

	<MerchText />
</main>

<style>
	.merch-stage {
		isolation: isolate;
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
