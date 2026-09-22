<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Tecnoesis is the annual techno-managerial event of NIT Silchar, bringing tech enthusiasts fascinating events, workshops, competitions, and interactions worth a lifetime."
	/>
	<meta
		name="keywords"
		content="Tecnoesis, Tecnoesis 2026, NIT Silchar, techno-managerial fest, technology fest, technical fest India, engineering college fest, coding competitions, tech workshops, innovation, entrepreneurship, robotics, programming, NIT Silchar events"
	/>
	<meta name="author" content="Tecnoesis, NIT Silchar" />
	<meta name="theme-color" content="#09062d" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Tecnoesis 2026" />
	<meta property="og:title" content="Tecnoesis 2026 | NIT Silchar" />
	<meta
		property="og:description"
		content="Tecnoesis is the annual techno-managerial event of NIT Silchar, bringing tech enthusiasts fascinating events, workshops, competitions, and interactions worth a lifetime."
	/>
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={`${page.url.origin}/tecnoesis_banner.png`} />
	<meta
		property="og:image:alt"
		content="Tecnoesis 2026, the techno-managerial fest of NIT Silchar"
	/>
	<meta property="og:locale" content="en_IN" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tecnoesis 2026 | NIT Silchar" />
	<meta
		name="twitter:description"
		content="Tecnoesis is the annual techno-managerial event of NIT Silchar, bringing tech enthusiasts fascinating events, workshops, competitions, and interactions worth a lifetime."
	/>
	<meta name="twitter:image" content={`${page.url.origin}/tecnoesis_banner.png`} />
	<meta
		name="twitter:image:alt"
		content="Tecnoesis 2026, the techno-managerial fest of NIT Silchar"
	/>
</svelte:head>
<div class="relative min-h-screen bg-[url('/background.jpg')] bg-cover bg-fixed bg-center">
	<div
		class="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(22,9,36,0.12),rgba(76,26,115,0.2))]"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_33%,rgba(223,164,255,0.18),transparent_25%)]"
		aria-hidden="true"
	></div>
	{#if page.url.pathname === '/home'}
		<nav
			class="fixed top-1/2 left-[0.9rem] z-20 flex -translate-y-1/2 rotate-180 flex-row items-center gap-[1.6rem] text-[0.72rem] tracking-[0.14em] text-white/80 uppercase [text-orientation:mixed] [writing-mode:vertical-rl] max-md:hidden"
			aria-label="Page sections"
		>
			<span>Hero</span>
			<span>About</span>
			<span>Events</span>
			<span>Sponsors</span>
		</nav>
	{/if}
	<!-- Phones: a compact centred row that sits in its own strip at the bottom.
	     The old w-[80%] bar stretched across the screen and covered the last
	     section. Large screens keep the vertical rail on the right. -->
	{#if page.url.pathname !== '/gallery'}
		<div
			class="fixed right-3 bottom-3 z-20 flex w-auto flex-row items-center justify-center gap-2 rounded-full border border-white/12 bg-black/40 px-2.5 py-1.5 backdrop-blur-md lg:right-8 lg:bottom-10 lg:w-10 lg:-translate-y-1/2 lg:flex-col lg:gap-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
		>
			<a
				class="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-white/35 bg-white/6 text-white/90 backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:border-white/60 hover:bg-white/15 lg:h-11 lg:w-11"
				href="https://instagram.com/tecnoesis"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Instagram"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle
						cx="12"
						cy="12"
						r="5"
					/><circle cx="17.5" cy="6.5" r="1.5" /></svg
				>
			</a>
			<a
				class="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-white/35 bg-white/6 text-white/90 backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:border-white/60 hover:bg-white/15 lg:h-11 lg:w-11"
				href="https://linkedin.com/company/tecnoesis"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="LinkedIn"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect
						x="2"
						y="9"
						width="4"
						height="12"
					/><circle cx="4" cy="4" r="2" /></svg
				>
			</a>
			<a
				class="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-white/35 bg-white/6 text-white/90 backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:border-white/60 hover:bg-white/15 lg:h-11 lg:w-11"
				href="https://facebook.com/tecnoesis"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Facebook"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg
				>
			</a>
		</div>
	{/if}
	<!-- The gallery has its own in-flow social links, without a floating strip. -->
	<div class={page.url.pathname === '/gallery' ? 'relative z-[1]' : 'relative z-[1] pb-16 lg:pb-0'}>
		{@render children()}
	</div>
</div>
