<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	const scrambleWords = [
		'TECHNOLOGY',
		'INNOVATION',
		'CREATIVITY',
		'FUTURE',
		'TEKNOESIS'
	];
</script>

<svelte:head>
	<title>Tecnoesis — NIT Silchar</title>
</svelte:head>

<div class="min-h-screen overflow-hidden bg-black text-white">

	<!-- ================================================= -->
	<!-- LEFT 15vw SCRAMBLE SECTION -->
	<!-- ================================================= -->

	<aside
		class="fixed left-0 top-0 z-40 flex h-screen w-[15vw] min-w-[120px] items-center justify-center overflow-hidden border-r border-white/10"
	>
		<div
			class="flex rotate-[-90deg] whitespace-nowrap text-[clamp(2rem,4vw,5rem)] font-black uppercase tracking-[-0.06em] text-white/[0.08]"
		>
			{#each scrambleWords as word}
				<span class="mr-16">{word}</span>
			{/each}
		</div>
	</aside>


	<!-- ================================================= -->
	<!-- MAIN 85vw SECTION -->
	<!-- ================================================= -->

	<main class="relative ml-[15vw] min-h-screen w-[85vw]">

		<!-- NAVBAR -->
		<Navbar />


		<!-- ============================================= -->
		<!-- BACKGROUND TEXT -->
		<!-- ============================================= -->

		<div
			class="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<div
				class="absolute left-[5%] top-[30%] whitespace-nowrap text-[15vw] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.025]"
			>
				TECNOESIS
			</div>
		</div>


		<!-- ============================================= -->
		<!-- HERO CONTENT -->
		<!-- ============================================= -->

		<section
			class="relative z-10 flex min-h-screen items-center px-10 pt-24 lg:px-16"
		>
			<div class="max-w-5xl">

				<!-- Small heading -->
				<p
					class="mb-6 text-[10px] font-medium uppercase tracking-[0.45em] text-white/40"
				>
					NIT Silchar presents
				</p>


				<!-- Main title -->
				<h1
					class="text-[clamp(5rem,11vw,12rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]"
				>
					TECNOESIS
				</h1>


				<!-- Description -->
				<p
					class="mt-10 max-w-lg text-sm leading-7 tracking-wide text-white/50"
				>
					Where technology meets imagination.
					Explore events, ideas and experiences built
					for the future.
				</p>


				<!-- CTA -->
				<div class="mt-10 flex items-center gap-6">

					<a
						href="/events"
						class="group relative overflow-hidden border border-white px-7 py-3 text-[10px] font-semibold tracking-[0.25em]"
					>
						<span
							class="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100"
						></span>

						<span
							class="relative z-10 transition-colors duration-300 group-hover:text-black"
						>
							EXPLORE EVENTS
						</span>
					</a>


					<a
						href="/schedule"
						class="text-[10px] font-semibold tracking-[0.25em] text-white/40 transition-colors duration-300 hover:text-white"
					>
						VIEW SCHEDULE →
					</a>

				</div>

			</div>
		</section>

	</main>
</div>