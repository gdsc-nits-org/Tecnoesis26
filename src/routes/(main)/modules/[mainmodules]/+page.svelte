<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
	const number = (value: number) => String(value).padStart(2, '0');
</script>

<svelte:head>
	<title>{data.module.name} | Tecnoesis 2026 Modules</title>
	<meta
		name="description"
		content={data.module.description || `Explore events in ${data.module.name}.`}
	/>
</svelte:head>

<main class="module-page" style={`--module-accent:${data.module.accent}`}>
	{#if data.module.coverImage}
		<img class="page-backdrop" src={data.module.coverImage} alt="" aria-hidden="true" />
	{/if}
	<div class="page-backdrop-shade" aria-hidden="true"></div>
	<div class="module-wrap">
		<nav class="breadcrumbs" aria-label="Breadcrumb">
			<a href={resolve('/modules')}>Modules</a>
			<span aria-hidden="true">/</span>
			<span aria-current="page">{data.module.name}</span>
		</nav>

		<section class="module-hero" aria-labelledby="module-title">
			<div class="hero-copy">
				<p class="eyebrow">
					<span class="status-dot" aria-hidden="true"></span>{data.module.kicker}
				</p>
				<h1 id="module-title">{data.module.name}</h1>
				{#if data.module.description}
					<p class="hero-description">{data.module.description}</p>
				{/if}
				<a class="explore-link" href="#module-events">
					<span>Discover the events</span>
					<span class="explore-arrow" aria-hidden="true">↓</span>
				</a>
				<div class="hero-facts" aria-label="Module summary">
					<div><strong>{number(data.module.events.length)}</strong><span>events</span></div>
					<div class="hero-location">
						<span>MODULE {number(data.moduleIndex + 1)}</span>
						<span>TECNOESIS 2026</span>
					</div>
				</div>
			</div>

			<div class="module-visual" aria-hidden="true">
				<span class="visual-orbit visual-orbit-outer"></span>
				<span class="visual-orbit visual-orbit-inner"></span>
				<span class="visual-cross">+</span>
				{#if data.module.coverImage}
					<div class="visual-poster-frame">
						<img src={data.module.coverImage} alt="" />
					</div>
				{:else}
					<span class="visual-index" aria-hidden="true">✦</span>
				{/if}
				<span class="visual-caption">ENTER THE<br />{data.module.name.toUpperCase()} UNIVERSE</span>
			</div>
		</section>

		<div class="archive-divider" aria-hidden="true">
			<span>THE {data.module.name.toUpperCase()} LINE-UP</span>
			<span class="divider-line"></span>
			<span>CHOOSE YOUR CHALLENGE ↓</span>
		</div>

		<section class="events" id="module-events" aria-labelledby="events-title">
			<div class="events-heading">
				<div>
					<p class="eyebrow">The line-up / {number(data.module.events.length)}</p>
					<h2 id="events-title">Make your <em>move.</em></h2>
				</div>
				<p class="events-instruction">
					Every event is a new way to play.<br />
					<span>Choose one and step into the challenge.</span>
				</p>
			</div>

			<div class="events-toolbar">
				<p class="section-mark">
					AVAILABLE EVENTS <span>/ {number(data.module.events.length)}</span>
				</p>
				<p class="frame-count">{data.module.name.toUpperCase()} <span>/</span> 2026</p>
			</div>

			{#if data.module.events.length}
				<div class="event-grid">
					{#each data.module.events as event, index (event.slug)}
						<!-- eslint-disable svelte/no-navigation-without-resolve -->
						<a
							class="event-card"
							href={`${resolve('/modules')}/${data.module.slug}/${event.slug}`}
							style={`--event-index:${index}`}
						>
							<div class="event-art" aria-hidden="true">
								{#if event.image}
									<img class="event-image" src={event.image} alt="" loading="lazy" />
								{/if}
								<div class="event-art-orbit"></div>
								<span class="event-open">↗</span>
								<span class="event-tag">EVENT / {data.module.name.toUpperCase()}</span>
							</div>
							<div class="event-copy">
								<div>
									<h3>{event.name}</h3>
									{#if event.description}
										<p>{event.description}</p>
									{/if}
								</div>
								<span class="event-arrow" aria-hidden="true">↗</span>
							</div>
						</a>
						<!-- eslint-enable svelte/no-navigation-without-resolve -->
					{/each}
				</div>
			{:else}
				<p class="empty-events">Events for this module will be announced soon.</p>
			{/if}
		</section>

		<footer class="module-footer">
			<a class="back-link" href={resolve('/modules')}>
				<span aria-hidden="true">←</span> Back to all modules
			</a>
			<a class="top-link" href="#module-title">Back to top <span aria-hidden="true">↗</span></a>
		</footer>
	</div>
</main>

<style>
	:global(body .site-header) {
		backdrop-filter: blur(16px);
	}
	.module-page {
		--paper: #f7f2ff;
		--muted: rgba(220, 210, 244, 0.62);
		--edge: rgba(190, 145, 255, 0.3);
		position: relative;
		isolation: isolate;
		min-height: 100svh;
		color: var(--paper);
		background:
			linear-gradient(180deg, rgba(22, 9, 36, 0.1), rgba(76, 26, 115, 0.2)),
			radial-gradient(circle at 50% 30%, rgba(223, 164, 255, 0.1), transparent 28%);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
	}
	.page-backdrop,
	.page-backdrop-shade {
		position: fixed;
		z-index: -1;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.page-backdrop {
		object-fit: cover;
		opacity: 0.38;
		filter: blur(28px);
		transform: scale(1.08);
	}
	.page-backdrop-shade {
		z-index: 0;
		background: rgba(9, 6, 37, 0.18);
	}
	.module-wrap {
		position: relative;
		z-index: 1;
		width: min(1440px, calc(100% - 144px));
		margin-inline: auto;
	}
	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-top: 118px;
		color: rgba(200, 186, 240, 0.55);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 12px;
	}
	.breadcrumbs a {
		color: rgba(222, 208, 250, 0.84);
		text-decoration: none;
		transition: color 180ms;
	}
	.breadcrumbs a:hover {
		color: #fff;
	}
	.breadcrumbs [aria-current='page'] {
		color: var(--module-accent);
	}
	.module-hero {
		display: grid;
		min-height: min(720px, 76svh);
		grid-template-columns: 1fr 0.9fr;
		align-items: center;
		gap: 48px;
		padding: 24px 0 56px;
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		color: var(--module-accent);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.2em;
		line-height: 1.7;
		text-transform: uppercase;
	}
	.status-dot {
		width: 6px;
		height: 6px;
		flex: 0 0 auto;
		border-radius: 50%;
		background: var(--module-accent);
		box-shadow: 0 0 14px color-mix(in srgb, var(--module-accent), transparent 10%);
	}
	.hero-copy h1 {
		position: relative;
		z-index: 1;
		max-width: 780px;
		margin: 30px 0 23px;
		color: #f7f2ff;
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: clamp(52px, 7vw, 104px);
		font-weight: 500;
		line-height: 0.98;
		letter-spacing: 0.02em;
		text-shadow:
			0 2px 0 color-mix(in srgb, var(--module-accent), transparent 40%),
			0 0 30px color-mix(in srgb, var(--module-accent), transparent 70%);
		text-transform: uppercase;
		overflow-wrap: anywhere;
	}
	.hero-description {
		max-width: 48ch;
		margin: 0;
		color: rgba(214, 200, 246, 0.82);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 14px;
		line-height: 1.85;
	}
	.explore-link {
		display: inline-flex;
		align-items: center;
		gap: 24px;
		margin-top: 28px;
		color: var(--paper);
		font-size: 11px;
		letter-spacing: 0.2em;
		text-decoration: none;
		text-transform: uppercase;
	}
	.explore-arrow {
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 34%);
		border-radius: 50%;
		color: var(--module-accent);
		transition:
			background 180ms,
			transform 180ms,
			box-shadow 180ms;
	}
	.explore-link:hover .explore-arrow {
		background: color-mix(in srgb, var(--module-accent), transparent 78%);
		box-shadow: 0 0 18px color-mix(in srgb, var(--module-accent), transparent 66%);
		transform: translateY(3px);
	}
	.hero-facts {
		display: flex;
		align-items: center;
		gap: 28px;
		margin-top: 48px;
	}
	.hero-facts > div {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.hero-facts strong {
		color: #f4efff;
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: 32px;
		font-weight: 500;
		line-height: 1;
		letter-spacing: 0.03em;
	}
	.hero-facts span {
		color: rgba(200, 186, 240, 0.6);
		font-size: 9px;
		line-height: 1.5;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.hero-facts .hero-location {
		gap: 3px;
		padding-left: 26px;
		border-left: 1px solid color-mix(in srgb, var(--module-accent), transparent 56%);
	}
	.module-visual {
		position: relative;
		display: grid;
		min-width: 0;
		aspect-ratio: 1;
		place-items: center;
		isolation: isolate;
	}
	.module-visual::before {
		position: absolute;
		inset: 12%;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--module-accent), transparent 75%),
			transparent 69%
		);
		content: '';
		filter: blur(14px);
	}
	.visual-orbit {
		position: absolute;
		width: 80%;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 62%);
		border-radius: 50%;
	}
	.visual-orbit-outer {
		box-shadow:
			0 0 0 25px color-mix(in srgb, var(--module-accent), transparent 95%),
			0 0 0 55px color-mix(in srgb, var(--module-accent), transparent 97%);
	}
	.visual-orbit-inner {
		width: 56%;
		border-style: dashed;
		transform: rotate(28deg) scaleX(0.72);
	}
	.visual-cross {
		position: absolute;
		top: 10%;
		left: 8%;
		color: var(--module-accent);
		font: 32px monospace;
		font-weight: 200;
		text-shadow: 0 0 18px var(--module-accent);
	}
	.visual-index {
		position: relative;
		z-index: 1;
		color: var(--module-accent);
		font-size: clamp(80px, 13vw, 180px);
		text-shadow: 0 0 36px color-mix(in srgb, var(--module-accent), transparent 30%);
	}
	.visual-poster-frame {
		position: relative;
		z-index: 1;
		width: 74%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		clip-path: polygon(
			100% 80%,
			50% 100%,
			0% 80%,
			0% 0%,
			20% 0%,
			30% 10%,
			70% 10%,
			80% 0%,
			100% 0%
		);
		background: color-mix(in srgb, var(--module-accent), #100a2e 55%);
		box-shadow: 0 18px 55px rgba(3, 2, 22, 0.42);
		transform: rotate(4deg);
		transition: transform 300ms ease;
	}
	.module-visual:hover .visual-poster-frame {
		transform: rotate(1deg) scale(1.035);
	}
	.visual-poster-frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.visual-caption {
		position: absolute;
		right: 0;
		bottom: 10%;
		color: rgba(200, 186, 240, 0.55);
		font-size: 8px;
		letter-spacing: 0.26em;
		line-height: 1.8;
		text-align: right;
	}
	.archive-divider {
		display: flex;
		align-items: center;
		gap: 22px;
		color: rgba(200, 186, 240, 0.55);
		font-size: 9px;
		letter-spacing: 0.26em;
	}
	.divider-line {
		height: 1px;
		flex: 1;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--module-accent), transparent 38%),
			transparent
		);
	}
	.events {
		padding-top: 74px;
		scroll-margin-top: 115px;
	}
	.events-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
	}
	.events-heading h2 {
		margin: 10px 0 0;
		color: #f7f2ff;
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: clamp(28px, 3vw, 44px);
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}
	.events-heading h2 em {
		color: var(--module-accent);
		font-family: 'Delicatus', 'Game Paused', sans-serif;
		font-style: normal;
		font-weight: 400;
	}
	.events-instruction {
		margin: 0 0 2px;
		color: rgba(214, 200, 246, 0.72);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 12px;
		line-height: 1.8;
	}
	.events-instruction span {
		color: rgba(200, 186, 240, 0.45);
	}
	.events-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin: 34px 0;
		padding-bottom: 25px;
		border-bottom: 1px solid var(--edge);
	}
	.section-mark,
	.frame-count {
		margin: 0;
		color: rgba(214, 200, 246, 0.7);
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.section-mark span,
	.frame-count span {
		margin-left: 7px;
		color: color-mix(in srgb, var(--module-accent), transparent 18%);
	}
	.event-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 34px 25px;
	}
	.event-card {
		display: block;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}
	.event-art {
		position: relative;
		display: grid;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		place-items: center;
		clip-path: polygon(
			100% 80%,
			50% 100%,
			0% 80%,
			0% 0%,
			20% 0%,
			30% 10%,
			70% 10%,
			80% 0%,
			100% 0%
		);
		background:
			radial-gradient(
				ellipse at 50% 48%,
				color-mix(in srgb, var(--module-accent), transparent 83%),
				transparent 68%
			),
			radial-gradient(circle, rgba(232, 219, 255, 0.2) 1px, transparent 1.5px) 0 0 / 18px 18px,
			linear-gradient(145deg, #1e143a, #090625);
	}
	.event-art::before {
		position: absolute;
		z-index: 1;
		inset: 0;
		background: linear-gradient(180deg, rgba(9, 6, 37, 0.08) 26%, rgba(9, 6, 37, 0.72));
		content: '';
		pointer-events: none;
	}
	.event-image {
		position: absolute;
		z-index: 0;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			filter 250ms,
			transform 350ms ease;
	}
	.event-card:hover .event-image,
	.event-card:focus-visible .event-image {
		filter: brightness(1.12);
		transform: scale(1.035);
	}
	.event-art::after {
		position: absolute;
		inset: 0;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 72%);
		clip-path: inherit;
		content: '';
		pointer-events: none;
		transition:
			border-color 200ms,
			box-shadow 200ms;
	}
	.event-art-orbit {
		position: absolute;
		z-index: 2;
		width: 58%;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 50%);
		border-radius: 50%;
		transition:
			transform 350ms ease,
			border-color 200ms,
			box-shadow 200ms;
	}
	.event-art-orbit::after {
		position: absolute;
		inset: 14%;
		border: 1px dashed color-mix(in srgb, var(--module-accent), transparent 38%);
		border-radius: 50%;
		content: '';
	}
	.event-card:hover .event-art-orbit,
	.event-card:focus-visible .event-art-orbit {
		border-color: var(--module-accent);
		box-shadow: 0 0 28px color-mix(in srgb, var(--module-accent), transparent 65%);
		transform: rotate(18deg) scale(1.08);
	}
	.event-tag {
		position: absolute;
		z-index: 2;
		color: var(--module-accent);
		font-size: 8px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.event-tag {
		bottom: 14px;
		left: 14px;
		max-width: calc(100% - 70px);
		overflow: hidden;
		color: rgba(222, 208, 250, 0.72);
		font-size: 7px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.event-open {
		position: absolute;
		z-index: 2;
		top: 12px;
		right: 12px;
		display: grid;
		width: 36px;
		height: 36px;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 40%);
		border-radius: 50%;
		background: rgba(18, 14, 53, 0.78);
		color: #fff;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 180ms,
			transform 180ms;
	}
	.event-card:hover .event-open,
	.event-card:focus-visible .event-open {
		opacity: 1;
		transform: translateY(0);
	}
	.event-copy {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 0 0;
		border-top: 1px solid transparent;
		transition: border-color 180ms;
	}
	.event-card:hover .event-copy,
	.event-card:focus-visible .event-copy {
		border-color: color-mix(in srgb, var(--module-accent), transparent 55%);
	}
	.event-copy h3 {
		margin: 0;
		color: #ece2ff;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 12px;
		line-height: 1.4;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.event-copy p {
		display: -webkit-box;
		overflow: hidden;
		margin: 7px 0 0;
		color: rgba(214, 200, 246, 0.67);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 12px;
		line-height: 1.6;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
	.event-arrow {
		display: grid;
		width: 30px;
		height: 30px;
		flex: 0 0 auto;
		place-items: center;
		border: 1px solid var(--edge);
		border-radius: 50%;
		color: var(--module-accent);
		transition:
			background 180ms,
			transform 180ms;
	}
	.event-card:hover .event-arrow,
	.event-card:focus-visible .event-arrow {
		border-color: transparent;
		background: color-mix(in srgb, var(--module-accent), #7a33e0 35%);
		transform: translate(2px, -2px);
	}
	.empty-events {
		padding: 30px;
		border: 1px solid var(--edge);
		color: rgba(214, 200, 246, 0.78);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 14px;
		text-align: center;
	}
	.module-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-top: 50px;
		padding: 30px 0 76px;
		border-top: 1px solid var(--edge);
	}
	.back-link,
	.top-link {
		display: inline-flex;
		align-items: center;
		gap: 13px;
		color: rgba(222, 208, 250, 0.85);
		font-size: 10px;
		letter-spacing: 0.18em;
		text-decoration: none;
		text-transform: uppercase;
		transition: color 180ms;
	}
	.back-link:hover,
	.top-link:hover {
		color: var(--module-accent);
	}
	.back-link span,
	.top-link span {
		color: var(--module-accent);
		font-size: 16px;
	}
	.module-page a:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--module-accent), white 18%);
		outline-offset: 5px;
	}
	@media (max-width: 1000px) {
		.module-wrap {
			width: min(100% - 72px, 850px);
		}
		.module-hero {
			min-height: 640px;
			grid-template-columns: 1fr 0.8fr;
			gap: 24px;
		}
		.event-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 700px) {
		.module-wrap {
			width: calc(100% - 40px);
		}
		.breadcrumbs {
			padding-top: 105px;
		}
		.module-hero {
			min-height: auto;
			grid-template-columns: 1fr;
			gap: 8px;
			padding: 54px 0 40px;
		}
		.hero-copy h1 {
			margin: 24px 0 18px;
			font-size: clamp(48px, 12vw, 78px);
		}
		.hero-description {
			font-size: 13px;
		}
		.module-visual {
			width: min(100%, 420px);
			margin: 0 auto;
		}
		.visual-caption {
			right: 4%;
		}
		.archive-divider {
			gap: 12px;
			font-size: 7px;
			letter-spacing: 0.16em;
		}
		.events {
			padding-top: 54px;
		}
		.events-heading {
			align-items: start;
			flex-direction: column;
			gap: 14px;
		}
		.events-instruction br {
			display: none;
		}
		.events-toolbar {
			margin: 24px 0;
			padding-bottom: 17px;
		}
		.section-mark,
		.frame-count {
			font-size: 8px;
		}
		.event-grid {
			gap: 27px 14px;
		}
		.event-copy h3 {
			font-size: 10px;
			letter-spacing: 0.08em;
		}
		.event-copy p {
			font-size: 11px;
		}
		.event-open {
			width: 31px;
			height: 31px;
			opacity: 1;
			transform: none;
		}
		.module-footer {
			margin-top: 38px;
			padding-bottom: 52px;
		}
	}
	@media (max-width: 420px) {
		.module-wrap {
			width: calc(100% - 32px);
		}
		.eyebrow {
			font-size: 8px;
			letter-spacing: 0.15em;
		}
		.events-toolbar {
			align-items: flex-start;
			flex-direction: column;
			gap: 8px;
		}
		.event-grid {
			grid-template-columns: 1fr;
			gap: 25px;
		}
		.module-footer {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.module-page *,
		.module-page *::before,
		.module-page *::after {
			scroll-behavior: auto !important;
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
		}
	}
</style>
