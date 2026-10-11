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
				class="flex w-full max-w-full min-w-0 flex-col items-center justify-center gap-3 sm:gap-5"
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

				<div class="flex w-full max-w-5xl min-w-0 flex-col gap-3 sm:gap-5">
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
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap');

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
			gap: clamp(0.5rem, 1.5vw, 1.25rem);
			padding: 0 clamp(0.5rem, 1.5vw, 1.5rem);
		}

		.sponsor-logo {
			display: grid;
			width: clamp(4.5rem, 8vw, 7rem);
			height: clamp(3.25rem, 5.5vw, 4.5rem);
			flex: 0 0 clamp(4.5rem, 8vw, 7rem);
			place-items: center;
			overflow: visible;
			border-radius: 0.75rem;
			background: #fff;
			padding: 0.5rem;
		}

		.sponsor-logo img {
			display: block;
			width: 100%;
			height: 100%;
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
			transform-origin: center;
			transition: transform 220ms ease;
		}

		.sponsor-logo:hover img {
			transform: scale(1.08);
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
