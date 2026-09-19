<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<svelte:head>
	<title>Tecnoesis</title>
	<meta
		name="description"
		content="Tecnoesis — NIT Silchar"
	/>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-black text-white">
	<!-- NAVBAR -->
	<Navbar />

	<!-- BACKGROUND RETRO TEXT -->
	<div
		class="pointer-events-none absolute left-0 top-0 -z-0 flex h-full w-full items-center overflow-hidden"
	>
		<div
			class="whitespace-nowrap text-[18vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.035]"
		>
			TECNOESIS&nbsp;&nbsp;&nbsp;TECNOESIS&nbsp;&nbsp;&nbsp;TECNOESIS
		</div>
	</div>

	<!-- HERO -->
	<main class="relative z-10 flex min-h-screen items-center px-8 pt-24">
		<div class="max-w-5xl">
			<p class="mb-5 text-xs font-medium uppercase tracking-[0.4em] text-white/50">
				NIT Silchar presents
			</p>

			<h1
				class="text-[clamp(4rem,12vw,11rem)] font-black uppercase leading-[0.8] tracking-[-0.07em]"
			>
				TECNOESIS
			</h1>

			<p
				class="mt-8 max-w-xl text-sm leading-7 tracking-wide text-white/60"
			>
				The annual techno-management festival of NIT Silchar.
			</p>

			<div class="mt-10 flex items-center gap-4">
				<a
					href="/events"
					class="border border-white px-6 py-3 text-xs font-semibold tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
				>
					EXPLORE EVENTS
				</a>

				<a
					href="/schedule"
					class="px-6 py-3 text-xs font-semibold tracking-[0.2em] text-white/60 transition-colors hover:text-white"
				>
					SCHEDULE →
				</a>
			</div>
		</div>
	</main>
</div>