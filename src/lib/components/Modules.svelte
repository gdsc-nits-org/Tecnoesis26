<script lang="ts">
	import { resolve } from '$app/paths';
	import imgMod from '$lib/assets/moduleImg.png';
	let { gifSrc = imgMod }: { gifSrc?: string } = $props();
</script>

<section class="modules">
	<div class="modules-glow" aria-hidden="true"></div>
	<div class="visual">
		<img src={gifSrc} alt="" />
		<h1 class="font-paused">MODULES</h1>
	</div>
	<a href={resolve('/home')} class="cyber-btn" aria-label="Explore modules">
		<span class="cyber-btn__border-glow" aria-hidden="true"></span>
		<span class="cyber-btn__backdrop" aria-hidden="true"></span>
		<span class="cyber-btn__shimmer" aria-hidden="true"></span>
		<span class="cyber-btn__content">
			<span class="cyber-btn__text">COMING SOON</span>
			<span class="cyber-btn__arrow" aria-hidden="true">
				<svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
					<path
						d="M5 15L15 5M15 5H7M15 5V13"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</span>
		<span class="cyber-btn__pip cyber-btn__pip--tl" aria-hidden="true"></span>
		<span class="cyber-btn__pip cyber-btn__pip--br" aria-hidden="true"></span>
	</a>
</section>

<style>
	.modules {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		min-height: 100svh;
		gap: 2.2rem;
		width: 100%;
		padding: 3rem 1.5rem;
		background: transparent;
		overflow: hidden;
		isolation: isolate;
	}

	@media (max-width: 1100px) and (orientation: portrait) {
		.modules {
			min-height: 88svh;
		}
	}

	.modules-glow {
		position: absolute;
		z-index: 0;
		width: min(90vw, 75rem);
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(167, 139, 250, 0.42) 0%,
			rgba(139, 92, 246, 0.2) 32%,
			rgba(76, 29, 149, 0.08) 58%,
			transparent 75%
		);
		filter: blur(40px);
		opacity: 0.75;
		pointer-events: none;
	}

	.visual {
		position: relative;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 100%;
		max-width: 960px;
		aspect-ratio: 16 / 8;
	}

	.visual img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		mix-blend-mode: screen;
		pointer-events: none;
		filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.35));
	}

	h1 {
		position: relative;
		z-index: 2;
		margin: 0;
		color: #fff;
		font-size: clamp(3.2rem, 11vw, 8.5rem);
		font-weight: 900;
		letter-spacing: 0.06em;
		line-height: 0.85;
		text-align: center;
		text-shadow:
			0 0 20px rgba(255, 255, 255, 0.85),
			0 0 45px rgba(167, 139, 250, 0.5),
			0 0 80px rgba(147, 51, 234, 0.3);
	}

	/* Futuristic Cyber Button */
	.cyber-btn {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 13px 30px;
		color: #ffffff;
		text-decoration: none;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.18em;
		max-width: 100%;
		overflow: hidden; /* Clips all children - nothing escapes button bounds */
		clip-path: polygon(
			10px 0%,
			100% 0%,
			100% calc(100% - 10px),
			calc(100% - 10px) 100%,
			0% 100%,
			0% 10px
		);
		transition:
			transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 260ms ease;
		cursor: pointer;
		isolation: isolate;
		outline: none;
	}

	.cyber-btn__backdrop {
		position: absolute;
		inset: 1.5px;
		background: linear-gradient(
			135deg,
			rgba(20, 16, 52, 0.88) 0%,
			rgba(38, 14, 68, 0.8) 50%,
			rgba(14, 12, 38, 0.92) 100%
		);
		backdrop-filter: blur(14px);
		clip-path: inherit;
		z-index: 1;
		transition: background 300ms ease;
	}

	.cyber-btn__border-glow {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(167, 139, 250, 0.9) 0%,
			rgba(236, 34, 184, 0.95) 50%,
			rgba(139, 92, 246, 0.85) 100%
		);
		clip-path: inherit;
		z-index: 0;
		transition:
			opacity 300ms ease,
			filter 300ms ease;
		box-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
	}

	.cyber-btn__shimmer {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.32) 50%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 2;
	}

	.cyber-btn:hover .cyber-btn__shimmer {
		animation: cyber-shimmer-sweep 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes cyber-shimmer-sweep {
		0% {
			transform: translateX(0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateX(200%);
			opacity: 0;
		}
	}

	.cyber-btn:hover {
		transform: translateY(-2px);
		filter: drop-shadow(0 0 16px rgba(167, 139, 250, 0.45));
	}

	.cyber-btn:hover .cyber-btn__backdrop {
		background: linear-gradient(
			135deg,
			rgba(38, 20, 80, 0.92) 0%,
			rgba(64, 18, 98, 0.88) 50%,
			rgba(24, 14, 60, 0.96) 100%
		);
	}

	.cyber-btn:hover .cyber-btn__border-glow {
		filter: brightness(1.25);
	}

	.cyber-btn:active {
		transform: translateY(0);
	}

	.cyber-btn:focus-visible {
		outline: 2px solid #a78bfa;
		outline-offset: 4px;
	}

	.cyber-btn__content {
		position: relative;
		z-index: 3;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.cyber-btn__tag {
		font-size: 10px;
		letter-spacing: 0.1em;
		color: #ec22b8;
		font-weight: 900;
	}

	.cyber-btn__text {
		color: #ffffff;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.55);
	}

	.cyber-btn__arrow {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		color: #d8b4fe;
		transition:
			transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
			color 240ms ease;
	}

	.cyber-btn__arrow svg {
		width: 15px;
		height: 15px;
	}

	.cyber-btn:hover .cyber-btn__arrow {
		transform: translate(3px, -3px) scale(1.15);
		color: #ffffff;
	}

	.cyber-btn__pip {
		position: absolute;
		width: 3.5px;
		height: 3.5px;
		background: #ffffff;
		box-shadow: 0 0 8px #ffffff;
		z-index: 4;
	}

	.cyber-btn__pip--tl {
		top: 3px;
		left: 3px;
	}

	.cyber-btn__pip--br {
		bottom: 3px;
		right: 3px;
	}

	@media (max-width: 600px) {
		.modules {
			gap: 1.5rem;
			padding: 2rem 1rem;
		}

		.visual {
			aspect-ratio: 5 / 3;
		}
	}
</style>
