<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { portalTransition } from '$lib/transition.svelte';

	let routeTransitionActive = $state(false);
	let routeTransitionRevealing = $state(false);
	let routeProgress = $state(0);
	let revealTimer: ReturnType<typeof setTimeout> | undefined;
	let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
	let progressTimer: ReturnType<typeof setInterval> | undefined;
	let navigationStartedAt = 0;

	beforeNavigate(({ from, to }) => {
		if (portalTransition.isActive || !from || !to) return;
		if (to.url.origin !== window.location.origin) return;
		if (
			from.url.pathname === to.url.pathname &&
			from.url.search === to.url.search &&
			from.url.hash === to.url.hash
		) {
			return;
		}

		if (revealTimer) clearTimeout(revealTimer);
		if (cleanupTimer) clearTimeout(cleanupTimer);
		if (progressTimer) clearInterval(progressTimer);

		routeTransitionActive = true;
		routeTransitionRevealing = false;
		routeProgress = 0;
		navigationStartedAt = performance.now();
		progressTimer = setInterval(() => {
			routeProgress = Math.min(92, ((performance.now() - navigationStartedAt) / 520) * 92);
		}, 24);
	});

	afterNavigate(() => {
		if (!routeTransitionActive) return;
		if (progressTimer) clearInterval(progressTimer);
		progressTimer = undefined;
		const remainingDisplayTime = Math.max(0, 520 - (performance.now() - navigationStartedAt));
		revealTimer = setTimeout(() => {
			routeProgress = 100;
			revealTimer = setTimeout(() => {
				routeTransitionRevealing = true;
				cleanupTimer = setTimeout(() => {
					routeTransitionActive = false;
					routeTransitionRevealing = false;
					routeProgress = 0;
					revealTimer = undefined;
					cleanupTimer = undefined;
				}, 850);
			}, 120);
		}, remainingDisplayTime);
	});

	onDestroy(() => {
		if (revealTimer) clearTimeout(revealTimer);
		if (cleanupTimer) clearTimeout(cleanupTimer);
		if (progressTimer) clearInterval(progressTimer);
	});

	const isTransitionVisible = $derived(portalTransition.isActive || routeTransitionActive);
	const isRevealing = $derived(portalTransition.stage === 'revealing' || routeTransitionRevealing);
	const progress = $derived(
		portalTransition.isActive
			? portalTransition.stage === 'revealing'
				? 100
				: portalTransition.progress
			: routeProgress
	);
</script>

{#if isTransitionVisible}
	<div class="route-transition" class:route-transition--revealing={isRevealing} aria-hidden="true">
		<div class="route-loader">
			<span class="route-loader__track">
				<span class="route-loader__bar" style={`transform: scaleX(${progress / 100})`}></span>
			</span>
		</div>
		<span class="route-transition__counter">
			{Math.floor(progress).toString().padStart(2, '0')}
		</span>
		<div class="route-transition__wipe"></div>
		<div class="route-transition__mark">
			<span class="route-transition__mark-bar"></span>
			<span class="route-transition__mark-stem"></span>
		</div>
	</div>
{/if}

<style>
	.route-transition {
		position: fixed;
		inset: 0;
		z-index: 100000;
		display: grid;
		place-items: center;
		overflow: hidden;
		background: #000;
		pointer-events: auto;
		animation: loader-enter 220ms ease-out both;
	}

	.route-transition--revealing {
		animation: loader-exit 850ms cubic-bezier(0.76, 0, 0.24, 1) both;
		pointer-events: none;
	}

	.route-loader {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(168px, calc(100vw - 48px));
		height: 34px;
		transform: translate(-50%, -50%);
		background: #353535;
		animation: loader-enter 260ms ease-out both;
	}

	.route-loader__track {
		position: absolute;
		inset: 0 11%;
		overflow: hidden;
	}

	.route-loader__bar {
		display: block;
		width: 100%;
		height: 100%;
		transform: scaleX(0);
		transform-origin: left center;
		background: #fff;
		transition: transform 70ms linear;
	}

	.route-transition__counter {
		position: absolute;
		bottom: max(1rem, env(safe-area-inset-bottom));
		left: max(1rem, env(safe-area-inset-left));
		color: #fff;
		font-family: Arial, Helvetica, sans-serif;
		font-size: clamp(3.5rem, 11vw, 10rem);
		font-weight: 300;
		line-height: 0.8;
		letter-spacing: -0.08em;
		font-variant-numeric: tabular-nums;
		transition: opacity 160ms ease;
		z-index: 2;
	}

	.route-transition__wipe {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: #f5f5f7;
		clip-path: polygon(40% 38%, 60% 38%, 60% 44%, 53% 44%, 53% 62%, 47% 62%, 47% 44%, 40% 44%);
		opacity: 0;
		pointer-events: none;
	}

	.route-transition--revealing .route-transition__wipe {
		animation: wipe-expand 850ms cubic-bezier(0.76, 0, 0.24, 1) both;
	}

	.route-transition__mark {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translate(-50%, -50%);
		opacity: 0;
		pointer-events: none;
	}

	.route-transition__mark-bar {
		width: 20vw;
		height: 6vh;
		background: #f5f5f7;
	}

	.route-transition__mark-stem {
		width: 6vw;
		height: 18vh;
		background: #f5f5f7;
	}

	.route-transition--revealing .route-transition__mark {
		opacity: 1;
		animation: mark-exit 180ms ease 180ms both;
	}

	.route-transition--revealing .route-transition__counter {
		opacity: 0;
		transition: opacity 140ms ease;
	}

	.route-transition--revealing .route-loader {
		animation: none;
		opacity: 0;
		transition: none;
	}

	@keyframes loader-enter {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes loader-exit {
		0%,
		72% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes mark-exit {
		to {
			opacity: 0;
		}
	}

	@keyframes wipe-expand {
		0% {
			opacity: 0;
			clip-path: polygon(40% 38%, 60% 38%, 60% 44%, 53% 44%, 53% 62%, 47% 62%, 47% 44%, 40% 44%);
		}
		10% {
			opacity: 1;
		}
		72% {
			opacity: 1;
			clip-path: polygon(0 0, 100% 0, 100% 35%, 100% 65%, 100% 100%, 0 100%, 0 65%, 0 35%);
		}
		100% {
			opacity: 0;
			clip-path: polygon(0 0, 100% 0, 100% 35%, 100% 65%, 100% 100%, 0 100%, 0 65%, 0 35%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.route-transition,
		.route-loader,
		.route-transition__wipe,
		.route-transition__mark,
		.route-transition__counter {
			animation-duration: 1ms;
			transition-duration: 1ms;
		}
	}
</style>
