<script lang="ts">
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { portalTransition } from '$lib/transition.svelte';

	// Subtle standard route navigation overlay (for non-portal routes)
	let isStandardNav = $state(false);
	let isStandardFading = $state(false);

	beforeNavigate((nav) => {
		// If portal warp is running, it handles its own transition
		if (portalTransition.isActive) return;

		// For standard route switches
		if (nav.to?.url.pathname !== nav.from?.url.pathname) {
			isStandardNav = true;
			isStandardFading = false;
		}
	});

	afterNavigate(() => {
		if (isStandardNav) {
			setTimeout(() => {
				isStandardFading = true;
			}, 60);
			setTimeout(() => {
				isStandardNav = false;
				isStandardFading = false;
			}, 450);
		}
	});
</script>

{#if portalTransition.isActive}
	<div
		class="portal-overlay"
		class:portal-overlay--charging={portalTransition.stage === 'charging'}
		class:portal-overlay--warping={portalTransition.stage === 'warping'}
		class:portal-overlay--navigating={portalTransition.stage === 'navigating'}
		class:portal-overlay--revealing={portalTransition.stage === 'revealing'}
		aria-hidden="true"
	>
		<!-- Deep space nebula atmosphere -->
		<div class="portal-nebula"></div>
		<div class="portal-stars"></div>

		<!-- Hyperspace 3D warp rays -->
		<div class="warp-rays">
			<span class="warp-ray ray-1"></span>
			<span class="warp-ray ray-2"></span>
			<span class="warp-ray ray-3"></span>
			<span class="warp-ray ray-4"></span>
			<span class="warp-ray ray-5"></span>
			<span class="warp-ray ray-6"></span>
			<span class="warp-ray ray-7"></span>
			<span class="warp-ray ray-8"></span>
		</div>

		<!-- Concentric expanding energy rings -->
		<div class="portal-rings">
			<div class="ring ring-outer"></div>
			<div class="ring ring-mid"></div>
			<div class="ring ring-inner"></div>
		</div>

		<!-- Central core emblem with energy bloom -->
		<div class="portal-core">
			<div class="core-aura"></div>
			<img class="core-logo" src="/TecnoLogoFull.png" alt="" />
		</div>

		<!-- Radiant celestial bloom for the transition hand-off -->
		<div class="portal-bloom"></div>

		<!-- High-Tech HUD Telemetry -->
		<div class="portal-hud">
			<div class="hud-header">
				<span class="hud-bracket">[</span>
				<span class="hud-tag">TECNOESIS 2026 // GATEWAY INTERFACE</span>
				<span class="hud-bracket">]</span>
			</div>

			<div class="hud-status">
				<span class="hud-pulse"></span>
				<span class="hud-text">{portalTransition.statusText}</span>
			</div>

			<div class="hud-meter">
				<div class="meter-track">
					<div class="meter-bar" style={`width: ${portalTransition.progress}%`}>
						<span class="meter-glow"></span>
					</div>
				</div>
				<span class="meter-pct">{portalTransition.progress}%</span>
			</div>
		</div>
	</div>
{:else if isStandardNav}
	<!-- Gentle, elegant ambient transition for standard page navigations -->
	<div
		class="standard-overlay"
		class:standard-overlay--fade={isStandardFading}
		aria-hidden="true"
	></div>
{/if}

<style>
	/* ── Portal Container ── */
	.portal-overlay {
		position: fixed;
		inset: 0;
		z-index: 100000;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: #060920;
		pointer-events: all;
		user-select: none;
		isolation: isolate;
	}

	/* ── Deep Nebula Backdrop ── */
	.portal-nebula {
		position: absolute;
		inset: -15%;
		background:
			radial-gradient(ellipse at 50% 45%, rgba(186, 73, 240, 0.45) 0%, rgba(85, 25, 175, 0.3) 30%, transparent 68%),
			radial-gradient(circle at 50% 50%, rgba(30, 80, 220, 0.3) 0%, transparent 55%),
			#060920;
		filter: blur(16px);
		z-index: 1;
		transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.portal-stars {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(1.5px 1.5px at 15% 25%, rgba(255, 255, 255, 0.8), transparent),
			radial-gradient(1.8px 1.8px at 75% 18%, rgba(220, 180, 255, 0.9), transparent),
			radial-gradient(2px 2px at 45% 80%, rgba(180, 220, 255, 0.85), transparent),
			radial-gradient(1px 1px at 85% 72%, rgba(255, 255, 255, 0.7), transparent),
			radial-gradient(2px 2px at 25% 65%, rgba(240, 160, 255, 0.9), transparent);
		background-size: 380px 380px;
		opacity: 0.6;
		z-index: 2;
	}

	/* ── 3D Hyperspace Warp Rays ── */
	.warp-rays {
		position: absolute;
		inset: 0;
		z-index: 3;
		pointer-events: none;
	}

	.warp-ray {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 2.5px;
		height: 200vh;
		transform-origin: top center;
		background: linear-gradient(
			180deg,
			rgba(240, 210, 255, 0.95) 0%,
			rgba(192, 132, 252, 0.65) 25%,
			rgba(147, 51, 234, 0.3) 55%,
			transparent 85%
		);
		opacity: 0;
		filter: drop-shadow(0 0 10px rgba(220, 150, 255, 0.8));
	}

	.portal-overlay--warping .warp-ray,
	.portal-overlay--navigating .warp-ray {
		animation: ray-accelerate 1.3s cubic-bezier(0.12, 0.8, 0.3, 1) infinite;
	}

	.ray-1 { transform: rotate(18deg); animation-delay: 0ms; width: 2.5px; }
	.ray-2 { transform: rotate(64deg); animation-delay: 110ms; width: 1.8px; }
	.ray-3 { transform: rotate(115deg); animation-delay: 40ms; width: 2.2px; }
	.ray-4 { transform: rotate(162deg); animation-delay: 180ms; width: 3px; }
	.ray-5 { transform: rotate(205deg); animation-delay: 80ms; width: 2px; }
	.ray-6 { transform: rotate(250deg); animation-delay: 140ms; width: 2.6px; }
	.ray-7 { transform: rotate(298deg); animation-delay: 20ms; width: 1.9px; }
	.ray-8 { transform: rotate(342deg); animation-delay: 90ms; width: 2.8px; }

	@keyframes ray-accelerate {
		0% {
			opacity: 0;
			transform: scaleY(0.1);
		}
		25% {
			opacity: 0.95;
		}
		60% {
			opacity: 0.75;
			transform: scaleY(1);
		}
		100% {
			opacity: 0;
			transform: scaleY(1.3);
		}
	}

	/* ── Concentric Portal Rings ── */
	.portal-rings {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		z-index: 4;
		pointer-events: none;
	}

	.ring {
		position: absolute;
		border-radius: 50%;
		aspect-ratio: 1;
		box-sizing: border-box;
		transform: scale(0.2);
		opacity: 0;
	}

	.ring-outer {
		width: min(75vw, 680px);
		border: 2px solid rgba(230, 190, 255, 0.75);
		box-shadow:
			0 0 50px rgba(210, 130, 255, 0.45),
			inset 0 0 40px rgba(160, 90, 255, 0.25);
	}

	.ring-mid {
		width: min(50vw, 440px);
		border: 1.5px solid rgba(200, 170, 255, 0.65);
		box-shadow:
			0 0 35px rgba(180, 110, 255, 0.4),
			inset 0 0 25px rgba(180, 110, 255, 0.2);
	}

	.ring-inner {
		width: min(30vw, 260px);
		border: 1.5px solid rgba(240, 220, 255, 0.85);
		box-shadow: 0 0 25px rgba(230, 170, 255, 0.5);
	}

	.portal-overlay--warping .ring-outer,
	.portal-overlay--navigating .ring-outer {
		animation: ring-expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
	}

	.portal-overlay--warping .ring-mid,
	.portal-overlay--navigating .ring-mid {
		animation: ring-expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) 180ms infinite;
	}

	.portal-overlay--warping .ring-inner,
	.portal-overlay--navigating .ring-inner {
		animation: ring-expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) 360ms infinite;
	}

	@keyframes ring-expand {
		0% {
			opacity: 0;
			transform: scale(0.15);
		}
		20% {
			opacity: 0.9;
		}
		65% {
			opacity: 0.6;
		}
		100% {
			opacity: 0;
			transform: scale(2.4);
		}
	}

	/* ── Core Logo Centerpiece ── */
	.portal-core {
		position: relative;
		z-index: 5;
		display: grid;
		place-items: center;
		width: min(72vw, 580px);
		max-width: 90vw;
		margin-bottom: clamp(40px, 8vh, 80px);
	}

	.core-aura {
		position: absolute;
		width: 140%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(220, 140, 255, 0.55) 0%,
			rgba(147, 51, 234, 0.3) 38%,
			transparent 70%
		);
		filter: blur(24px);
		animation: aura-pulse 1.4s ease-in-out infinite alternate;
	}

	.core-logo {
		position: relative;
		z-index: 2;
		width: 100%;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 0 20px rgba(220, 160, 255, 0.65)) drop-shadow(0 0 45px rgba(147, 51, 234, 0.45));
		animation: core-zoom 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
	}

	@keyframes aura-pulse {
		from {
			opacity: 0.6;
			transform: scale(0.92);
		}
		to {
			opacity: 1;
			transform: scale(1.15);
		}
	}

	@keyframes core-zoom {
		0% {
			transform: scale(0.94);
		}
		100% {
			transform: scale(1.05);
		}
	}

	/* ── Radiant Transition Bloom ── */
	.portal-bloom {
		position: absolute;
		inset: 0;
		z-index: 8;
		pointer-events: none;
		opacity: 0;
		background: radial-gradient(
			circle at center,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(230, 190, 255, 0.85) 30%,
			rgba(160, 80, 240, 0.6) 65%,
			rgba(9, 6, 45, 0.95) 100%
		);
		transition: opacity 350ms ease;
	}

	.portal-overlay--navigating .portal-bloom {
		opacity: 0.85;
	}

	/* ── The Reveal Dissolve into Destination ── */
	.portal-overlay--revealing {
		opacity: 0;
		clip-path: circle(150% at 50% 50%);
		transition:
			opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
			clip-path 700ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* ── Sci-Fi HUD Telemetry ── */
	.portal-hud {
		position: absolute;
		bottom: clamp(28px, 6vh, 64px);
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		font-family: 'Bruno Ace', 'BankGothic', sans-serif;
		color: #f5f0ff;
		text-align: center;
		padding: 0 20px;
		max-width: 90vw;
	}

	.hud-header {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: clamp(9px, 1.1vw, 11px);
		letter-spacing: 0.22em;
		color: rgba(220, 180, 255, 0.85);
	}

	.hud-bracket {
		color: #f472b6;
		font-weight: 700;
	}

	.hud-status {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: clamp(11px, 1.4vw, 14px);
		letter-spacing: 0.16em;
		color: #ffffff;
		text-shadow: 0 0 10px rgba(220, 170, 255, 0.7);
	}

	.hud-pulse {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ec4899;
		box-shadow: 0 0 10px #ec4899;
		animation: pulse-dot 0.8s ease-in-out infinite alternate;
	}

	@keyframes pulse-dot {
		from { opacity: 0.4; transform: scale(0.8); }
		to { opacity: 1; transform: scale(1.3); }
	}

	.hud-meter {
		display: flex;
		align-items: center;
		gap: 14px;
		width: min(85vw, 360px);
	}

	.meter-track {
		flex: 1;
		height: 4px;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 2px;
		overflow: hidden;
		position: relative;
	}

	.meter-bar {
		height: 100%;
		background: linear-gradient(90deg, #c084fc, #f472b6, #ec4899);
		border-radius: 2px;
		position: relative;
		transition: width 40ms linear;
	}

	.meter-glow {
		position: absolute;
		right: 0;
		top: -2px;
		bottom: -2px;
		width: 10px;
		border-radius: 50%;
		background: #ffffff;
		box-shadow: 0 0 10px #f472b6, 0 0 18px #ffffff;
	}

	.meter-pct {
		font-size: 11px;
		letter-spacing: 0.1em;
		color: #f472b6;
		min-width: 38px;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	/* ── Standard Route Navigation Overlay (Soft glassmorphic fade) ── */
	.standard-overlay {
		position: fixed;
		inset: 0;
		z-index: 99990;
		pointer-events: none;
		background: rgba(9, 6, 45, 0.65);
		backdrop-filter: blur(8px);
		opacity: 1;
		transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.standard-overlay--fade {
		opacity: 0;
	}
</style>
