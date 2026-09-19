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
	<meta property="og:image:alt" content="Tecnoesis 2026, the techno-managerial fest of NIT Silchar" />
	<meta property="og:locale" content="en_IN" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tecnoesis 2026 | NIT Silchar" />
	<meta
		name="twitter:description"
		content="Tecnoesis is the annual techno-managerial event of NIT Silchar, bringing tech enthusiasts fascinating events, workshops, competitions, and interactions worth a lifetime."
	/>
	<meta name="twitter:image" content={`${page.url.origin}/tecnoesis_banner.png`} />
	<meta name="twitter:image:alt" content="Tecnoesis 2026, the techno-managerial fest of NIT Silchar" />
</svelte:head>
{@render children()}
