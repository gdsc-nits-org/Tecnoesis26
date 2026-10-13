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
		}, 32);
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
				}, 900);
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
			<span class="route-loader__label">LOADING...</span>
			<span class="route-loader__track">
				<span class="route-loader__bar" style={`transform: scaleX(${progress / 100})`}></span>
			</span>
			<span class="route-loader__counter">
				{Math.floor(progress).toString().padStart(2, '0')}%
			</span>
		</div>
		<img class="route-transition__logo" src="/logo.png" alt="" />
		<div class="route-transition__blend"></div>
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
		will-change: opacity;
	}

	.route-transition--revealing {
		animation: transition-exit 900ms cubic-bezier(0.76, 0, 0.24, 1) both;
		pointer-events: none;
	}

	.route-loader {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 3;
		display: flex;
		width: min(78vw, 610px);
		flex-direction: column;
		gap: 14px;
		transform: translate(-50%, -50%);
		animation: loader-enter 260ms ease-out both;
	}

	.route-loader__label {
		color: #c4b5fd;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.42em;
		line-height: 1;
	}

	.route-loader__track {
		position: relative;
		display: block;
		width: 100%;
		height: clamp(18px, 3vw, 24px);
		overflow: hidden;
		border: 1px solid #7c3aed;
		border-radius: 7px;
		background: #100b1d;
		box-shadow: 0 0 14px rgb(124 58 237 / 18%);
	}

	.route-loader__bar {
		position: absolute;
		inset: 3px;
		display: block;
		width: calc(100% - 6px);
		border-radius: 2px;
		transform: scaleX(0);
		transform-origin: left center;
		background: repeating-linear-gradient(
			45deg,
			#8b5cf6 0 12px,
			#c4b5fd 12px 18px,
			#6d28d9 18px 30px
		);
		background-size: 42px 42px;
		animation: loader-stripes 900ms linear infinite;
		transition: transform 70ms linear;
		will-change: transform;
	}

	.route-loader__counter {
		align-self: center;
		color: #ede9fe;
		font-size: clamp(0.95rem, 2.2vw, 1.25rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.08em;
		font-variant-numeric: tabular-nums;
	}

	.route-transition__logo {
		position: absolute;
		top: 42%;
		left: 50%;
		z-index: 2;
		width: clamp(7rem, 19vw, 15rem);
		height: auto;
		object-fit: contain;
		transform: translate(-50%, -50%) scale(0.72);
		transform-origin: center;
		filter: drop-shadow(0 0 22px rgb(167 139 250 / 55%));
		opacity: 0;
		pointer-events: none;
		will-change: transform, opacity;
	}

	.route-transition__blend {
		position: absolute;
		inset: 0;
		z-index: 2;
		background: rgb(0 0 0 / 0%);
		backdrop-filter: blur(22px);
		opacity: 0;
		pointer-events: none;
		will-change: opacity;
	}

	.route-transition--revealing .route-transition__logo {
		animation: logo-blend 700ms cubic-bezier(0.65, 0, 0.35, 1) 180ms forwards;
	}

	.route-transition--revealing .route-transition__blend {
		animation: blend-logo 700ms cubic-bezier(0.65, 0, 0.35, 1) 180ms forwards;
	}

	.route-transition--revealing .route-loader {
		animation: loader-exit 160ms ease-out both;
	}

	@keyframes loader-enter {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes transition-exit {
		0%,
		78% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes loader-exit {
		to {
			opacity: 0;
		}
	}

	@keyframes logo-blend {
		0% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(0.72);
		}
		38% {
			opacity: 0.78;
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(30);
		}
	}

	@keyframes blend-logo {
		0% {
			opacity: 0;
		}
		36% {
			opacity: 0.45;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes loader-stripes {
		to {
			background-position: 42px 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.route-transition,
		.route-loader,
		.route-transition__logo,
		.route-transition__blend,
		.route-transition__blend::before,
		.route-loader__bar {
			animation-duration: 1ms;
			transition-duration: 1ms;
		}
		.route-transition--revealing .route-transition__logo,
		.route-transition--revealing .route-transition__blend {
			animation-delay: 0ms;
		}
	}
</style>
