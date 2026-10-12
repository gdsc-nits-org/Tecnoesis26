<div class="mt-8 flex w-fit max-w-full flex-col gap-6 md:mt-0">
	<div class="flex items-end">
		<span
			class="rotate-180 font-valorax text-xl font-bold tracking-widest text-white [writing-mode:vertical-rl]"
		>
			FROM THE
		</span>

		<h1
			class="flex rotate-180 flex-col font-paused text-[clamp(80px,12vw,145px)] leading-[0.95] font-black [writing-mode:vertical-rl]"
		>
			<span class="text-[#BF5CF3]">NEXT</span>
			<span class="text-[#EC22B8]">ERA</span>
		</h1>
	</div>

	<p class="border-t-2 border-white/80 pt-1 font-orbitron text-xs tracking-widest text-white/90">
		THE FUTURE HAS A TEXTURE
	</p>

	<a href="/merch" class="cyber-btn" aria-label="Explore merchandise">
		<span class="cyber-btn__border-glow" aria-hidden="true"></span>
		<span class="cyber-btn__backdrop" aria-hidden="true"></span>
		<span class="cyber-btn__shimmer" aria-hidden="true"></span>
		<span class="cyber-btn__content">
			<span class="cyber-btn__text">HAVE A LOOK</span>
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
</div>

<style>
	.cyber-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 13px 28px;
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
			rgba(191, 92, 243, 0.9) 0%,
			rgba(236, 34, 184, 0.95) 50%,
			rgba(147, 51, 234, 0.85) 100%
		);
		clip-path: inherit;
		z-index: 0;
		transition:
			opacity 300ms ease,
			filter 300ms ease;
		box-shadow: 0 0 20px rgba(236, 34, 184, 0.3);
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
		filter: drop-shadow(0 0 16px rgba(236, 34, 184, 0.45));
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
		outline: 2px solid #f472b6;
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
		color: #f5b4e8;
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
</style>
