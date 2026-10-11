<script lang="ts">
	import ShapeBlur from './ShapeBlur.svelte';
	import previousSponsors from '$lib/data/previous-sponsors.json';

	type Sponsor = {
		sponsor_name: string;
		sponsor_img: string;
	};

	let { sponsors = [] }: { sponsors?: Sponsor[] } = $props();

	type PreviousSponsor = (typeof previousSponsors.topRow)[number];
	const sponsorRows: PreviousSponsor[][] = [previousSponsors.topRow, previousSponsors.bottomRow];
</script>

<main
	data-sponsors-section
	class="relative flex min-h-screen flex-col overflow-visible pb-4 lg:h-screen lg:min-h-0 lg:flex-row lg:overflow-hidden lg:pb-0"
>
	<!-- Mobile / Small tablet title (Desktop has SectionRail displaying SPONSORS) -->
	<div
		class="flex min-h-[12vh] w-full items-center justify-center py-6 font-['Bruno_Ace'] text-[clamp(2rem,7vw,3rem)] text-white sm:text-[clamp(2.25rem,5vw,3rem)] md:text-[clamp(2.5rem,4vw,3.25rem)] lg:hidden"
	>
		SPONSORS
	</div>
	<!-- Content Section (Flows naturally with standard page scroll) -->
	<div class="flex w-full flex-1 items-center justify-center py-8 lg:w-[85vw] lg:py-12">
		<div class="w-full px-4 lg:w-[90%]">
			{#if sponsors.length}
				<div class="flex w-full flex-wrap items-center justify-center gap-4 py-4 sm:gap-6 lg:gap-8">
					{#each sponsors as sponsor (sponsor.sponsor_name)}
						<div
							class="group relative flex h-44 w-full max-w-[18rem] items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 sm:h-52 sm:max-w-[20rem] lg:h-64 lg:max-w-[22rem]"
							title={sponsor.sponsor_name}
						>
							<img
								src={sponsor.sponsor_img}
								alt={sponsor.sponsor_name}
								title={sponsor.sponsor_name}
								loading="lazy"
								class="absolute top-1/2 left-1/2 z-0 h-[50%]! w-[50%]! -translate-x-1/2 -translate-y-1/2 object-contain p-2 transition-transform duration-300 group-hover:scale-105 lg:h-[70%] lg:w-[70%] lg:p-6"
							/>
							<div class="pointer-events-none absolute inset-0 z-10">
								<ShapeBlur variation={0} borderSize={0.02} shapeSize={1.4} circleSize={0.4} />
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex min-h-[20rem] items-center justify-center py-8">
					<p
						class="text-center font-['Bruno_Ace'] text-2xl tracking-[0.18em] text-white/80 sm:text-4xl"
					>
						REVEALING IT SOON!
					</p>
				</div>
			{/if}

		<!-- Previous Sponsors Section -->
		<section
			class="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-3 sm:gap-5"
		>
			<div class="flex items-center gap-3">
				<span class="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/40 sm:w-16"></span>
				<h2
					class="font-['Bruno_Ace'] text-base tracking-[0.16em] text-white/90 sm:text-xl lg:text-2xl"
				>
					PREVIOUS SPONSORS
				</h2>
				<span class="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/40 sm:w-16"></span>
			</div>

			<div class="flex w-full min-w-0 max-w-5xl flex-col gap-3 sm:gap-5">
				{#each sponsorRows as row, rowIndex (rowIndex)}
					<div
						class="sponsor-marquee"
						aria-label={`${rowIndex === 0 ? 'Primary' : 'Community'} previous sponsors`}
					>
						<div class:reverse={rowIndex === 1} class="sponsor-track">
							{#each [0, 1] as pass (pass)}
								<div class="sponsor-set" aria-hidden={pass === 1}>
									{#each row as sponsor (sponsor.name)}
										<div class="sponsor-logo" title={sponsor.name}>
											<img
												src={sponsor.image}
												alt={pass === 0 ? sponsor.name : ''}
												loading="lazy"
											/>
										</div>
									{/each}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap');

	.revealing-banner {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1.25rem 1.5rem;
		border-radius: 16px;
		background: rgba(14, 12, 38, 0.65);
		border: 1px solid rgba(226, 213, 255, 0.2);
		backdrop-filter: blur(12px);
		box-shadow:
			0 10px 30px rgba(5, 7, 28, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		overflow: hidden;
	}

	.revealing-banner__glow {
		position: absolute;
		top: -50%;
		left: 20%;
		width: 60%;
		height: 200%;
		background: radial-gradient(
			circle,
			rgba(191, 92, 243, 0.25) 0%,
			rgba(236, 34, 184, 0.12) 40%,
			transparent 70%
		);
		filter: blur(25px);
		pointer-events: none;
	}

	.revealing-banner__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.revealing-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 3px 10px;
		border-radius: 9999px;
		background: rgba(236, 34, 184, 0.15);
		border: 1px solid rgba(236, 34, 184, 0.35);
	}

	.revealing-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #ec22b8;
		box-shadow: 0 0 8px #ec22b8;
		animation: pulse-dot 2s ease-in-out infinite;
	}

	.revealing-tag {
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 10px;
		letter-spacing: 0.14em;
		color: #f5b4e8;
		font-weight: 700;
	}

	@keyframes pulse-dot {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.4;
			transform: scale(0.8);
		}
	}

	:global {
		@keyframes sponsors-scroll {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(-50%);
			}
		}

		.sponsor-marquee {
			position: relative;
			width: 100%;
			max-width: 100%;
			overflow: hidden;
			mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
			-webkit-mask-image: linear-gradient(
				90deg,
				transparent 0%,
				#000 8%,
				#000 92%,
				transparent 100%
			);
		}

		.sponsor-track {
			display: flex;
			width: max-content;
			animation: sponsors-scroll 24s linear infinite;
			will-change: transform;
		}

		.sponsor-track.reverse {
			animation-name: sponsors-scroll-reverse;
			animation-duration: 27s;
		}

		.sponsor-set {
			display: flex;
			min-width: 100%;
			align-items: center;
			justify-content: space-around;
			gap: clamp(1rem, 2.5vw, 3rem);
			padding: 0 clamp(0.5rem, 1.5vw, 1.5rem);
		}

		.sponsor-logo {
			display: grid;
			width: clamp(5rem, 10vw, 10rem);
			height: clamp(3.2rem, 6vw, 5rem);
			flex: 0 0 clamp(5rem, 10vw, 10rem);
			place-items: center;
			padding: 0.25rem 0.5rem;
		}

		.sponsor-logo img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
			filter: drop-shadow(0 0 10px rgba(216, 160, 255, 0.2));
			transition:
				transform 220ms ease,
				filter 220ms ease;
		}

		.sponsor-logo:hover img {
			transform: scale(1.1);
			filter: drop-shadow(0 0 18px rgba(236, 34, 184, 0.45));
		}

		@keyframes sponsors-scroll-reverse {
			from {
				transform: translateX(-50%);
			}
			to {
				transform: translateX(0);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.sponsor-track {
				animation-play-state: paused;
			}
		}
	}
</style>
