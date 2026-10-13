<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	const number = (value: number) => String(value).padStart(2, '0');
</script>

<svelte:head>
	<title>Modules | Tecnoesis 2026</title>
	<meta name="description" content="Explore the modules and events at Tecnoesis 2026." />
</svelte:head>

<main class="modules-page" id="modules-top">
	<div class="modules-wrap">
		<section class="modules-hero" aria-labelledby="modules-title">
			<div class="hero-copy">
				<p class="eyebrow">
					<span class="status-dot" aria-hidden="true"></span> The Tecnoesis universe
					<span class="edition">/ 2026</span>
				</p>
				<h1 id="modules-title"><span>Find your</span><em>arena.</em></h1>
				<p class="hero-description">
					One festival. A universe of ideas, challenges, and unexpected victories.<br />
					Choose a module and find the event that feels like yours.
				</p>
				<a class="explore-link" href="#module-collection">
					<span>Explore the modules</span>
					<span class="explore-arrow" aria-hidden="true">↓</span>
				</a>
				<div class="hero-facts" aria-label="Module summary">
					<div><strong>{number(data.modules.length)}</strong><span>modules</span></div>
					<div class="hero-location">
						<span>TECNOESIS 2026</span><span>NIT SILCHAR</span>
					</div>
				</div>
			</div>

			<div class="hero-montage" aria-hidden="true">
				<span class="montage-orbit" aria-hidden="true"></span>
				<span class="montage-cross" aria-hidden="true">+</span>
				<span class="montage-note">A FESTIVAL. A UNIVERSE.</span>
				<img class="neural-art" src="/modules_bg.svg" alt="" fetchpriority="high" />
				<span class="neural-label">TECNOESIS <i></i> 2026</span>
				<span class="frame-note">FIND YOUR PLACE IN THE LINE-UP.</span>
			</div>
		</section>

		<div class="archive-divider" aria-hidden="true">
			<span>THE EVENT UNIVERSE</span><span class="divider-line"></span><span
				>CHOOSE YOUR ARENA ↓</span
			>
		</div>

		<section class="collection" id="module-collection" aria-label="Festival modules">
			<div class="collection-heading">
				<div>
					<p class="eyebrow">The line-up</p>
					<h2>Enter a <em>new world.</em></h2>
				</div>
				<p class="collection-instruction">
					Every module opens a world of its own.<br />
					<span>Step in to discover its events.</span>
				</p>
			</div>

			<div class="collection-toolbar">
				<p class="section-mark">AVAILABLE MODULES <span>/ {number(data.modules.length)}</span></p>
				<p class="frame-count">TECNOESIS <span>/</span> 2026</p>
			</div>

			{#if data.modules.length}
				<div class="module-grid">
					{#each data.modules as module, index (module.slug)}
						<a
							class="module-card"
							href={resolve(`/modules/${module.slug}`)}
							style={`--module-accent:${module.accent}`}
						>
							<div class="module-visual">
								{#if module.coverImage}
									<img src={module.coverImage} alt="" loading="lazy" />
								{:else}
									<div class="module-placeholder" aria-hidden="true">
										<span>{number(index + 1)}</span>
										<i></i>
									</div>
								{/if}
								<span class="module-number">{number(index + 1)}</span>
								<span class="module-open" aria-hidden="true">↗</span>
								<span class="module-category">{module.kicker}</span>
							</div>
							<div class="module-caption">
								<div>
									<h3>{module.name}</h3>
									{#if module.description}
										<p>{module.description}</p>
									{/if}
								</div>
								<span class="caption-arrow" aria-hidden="true">↗</span>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<p class="empty-catalog">Modules will be announced soon.</p>
			{/if}
		</section>

		<footer class="modules-footer">
			<div>
				<span class="eyebrow">Your next chapter starts here</span>
				<p>Make room for the unexpected.</p>
			</div>
			<a href="#modules-top">Back to top <span aria-hidden="true">↗</span></a>
		</footer>
	</div>
</main>

<style>
	:global(body .site-header) {
		backdrop-filter: blur(16px);
	}
	.modules-page {
		--paper: #f7f2ff;
		--muted: rgba(220, 210, 244, 0.62);
		--accent: #d8a0ff;
		--edge: rgba(190, 145, 255, 0.3);
		min-height: 100svh;
		color: var(--paper);
		background:
			linear-gradient(180deg, rgba(22, 9, 36, 0.1), rgba(76, 26, 115, 0.2)),
			radial-gradient(circle at 50% 33%, rgba(223, 164, 255, 0.1), transparent 25%);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
	}
	.modules-wrap {
		width: min(1440px, calc(100% - 144px));
		margin: 0 auto;
	}
	.modules-hero {
		display: grid;
		min-height: min(870px, 100svh);
		grid-template-columns: 1fr 1.04fr;
		align-items: center;
		gap: 48px;
		padding: 160px 0 62px;
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		color: var(--accent);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.22em;
		line-height: 1.6;
		text-transform: uppercase;
	}
	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #e68cff;
		box-shadow: 0 0 14px rgba(214, 138, 255, 0.85);
	}
	.edition {
		margin-left: 4px;
		color: rgba(200, 186, 240, 0.55);
	}
	h1 {
		margin: 30px 0 23px;
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: clamp(54px, 7vw, 104px);
		font-weight: 500;
		line-height: 0.98;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		text-shadow:
			0 2px 0 rgba(109, 58, 170, 0.75),
			0 0 22px rgba(192, 136, 255, 0.32);
	}
	h1 span,
	h1 em {
		display: block;
	}
	h1 em {
		color: #e2b6ff;
		font-family: 'Delicatus', 'Game Paused', sans-serif;
		font-size: 1.08em;
		font-weight: 400;
		font-style: normal;
		letter-spacing: 0.04em;
		text-transform: lowercase;
	}
	.hero-description {
		max-width: 46ch;
		margin: 0;
		color: rgba(214, 200, 246, 0.82);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 14px;
		line-height: 1.85;
		letter-spacing: 0.01em;
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
		border: 1px solid rgba(170, 116, 255, 0.55);
		border-radius: 50%;
		transition:
			background 180ms,
			transform 180ms,
			box-shadow 180ms;
	}
	.explore-link:hover .explore-arrow {
		border-color: var(--accent);
		background: rgba(120, 58, 205, 0.4);
		box-shadow: 0 0 18px rgba(168, 85, 247, 0.4);
		transform: translateY(3px);
	}
	.hero-facts {
		display: flex;
		align-items: center;
		gap: 28px;
		margin-top: 53px;
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
		border-left: 1px solid rgba(170, 116, 255, 0.3);
	}
	.hero-location span {
		font-size: 9px;
		letter-spacing: 0.08em;
	}
	.hero-montage {
		position: relative;
		min-width: 0;
		height: clamp(420px, 42vw, 595px);
	}
	.montage-orbit {
		position: absolute;
		top: 0;
		right: -3%;
		width: 90%;
		aspect-ratio: 1;
		border: 1px solid rgba(170, 116, 255, 0.24);
		border-radius: 50%;
	}
	.montage-orbit::after {
		position: absolute;
		inset: 25px;
		border: 1px dashed rgba(214, 138, 255, 0.16);
		border-radius: 50%;
		content: '';
	}
	.montage-cross {
		position: absolute;
		top: 5%;
		left: 0;
		color: var(--accent);
		font: 28px monospace;
		font-weight: 200;
		text-shadow: 0 0 14px rgba(214, 138, 255, 0.6);
	}
	.montage-note {
		position: absolute;
		top: 28%;
		right: -12px;
		color: rgba(200, 186, 240, 0.5);
		font-size: 9px;
		letter-spacing: 0.3em;
		writing-mode: vertical-rl;
	}
	.neural-art {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 118%;
		max-width: none;
		height: 118%;
		object-fit: contain;
		opacity: 0.82;
		filter: drop-shadow(0 0 34px rgba(167, 139, 250, 0.42));
		pointer-events: none;
		transform: translate(-50%, -50%);
	}
	.neural-label {
		position: absolute;
		right: 1%;
		bottom: 10%;
		display: flex;
		align-items: center;
		gap: 10px;
		color: rgba(226, 201, 255, 0.82);
		font-size: 9px;
		letter-spacing: 0.24em;
	}
	.neural-label i {
		width: 42px;
		height: 1px;
		background: linear-gradient(90deg, var(--accent), transparent);
	}
	.frame-note {
		position: absolute;
		top: -18px;
		left: 11%;
		color: rgba(200, 186, 240, 0.45);
		font-size: 8px;
		letter-spacing: 0.3em;
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
		background: linear-gradient(90deg, transparent, rgba(170, 116, 255, 0.4), transparent);
	}
	.collection {
		padding-top: 74px;
		scroll-margin-top: 115px;
	}
	.collection-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
	}
	h2 {
		margin: 10px 0 0;
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: clamp(26px, 2.8vw, 42px);
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}
	h2 em {
		color: #e2b6ff;
		font-family: 'Delicatus', 'Game Paused', sans-serif;
		font-style: normal;
		font-weight: 400;
	}
	.collection-instruction {
		margin: 0 0 2px;
		color: rgba(214, 200, 246, 0.72);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 12px;
		line-height: 1.8;
	}
	.collection-instruction span {
		color: rgba(200, 186, 240, 0.45);
	}
	.collection-toolbar {
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
		color: rgba(170, 116, 255, 0.7);
	}
	.module-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 34px 25px;
	}
	.module-card {
		display: block;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}
	.module-visual {
		position: relative;
		overflow: hidden;
		aspect-ratio: 4/3;
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
		background: #120e35;
	}
	.module-visual > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			filter 250ms,
			transform 350ms ease;
	}
	.module-card:hover .module-visual > img,
	.module-card:focus-visible .module-visual > img {
		filter: brightness(1.12);
		transform: scale(1.035);
	}
	.module-placeholder {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		background:
			radial-gradient(
				ellipse at 50% 48%,
				color-mix(in srgb, var(--module-accent), transparent 76%),
				transparent 68%
			),
			radial-gradient(circle, rgba(232, 219, 255, 0.2) 1px, transparent 1.5px) 0 0 / 18px 18px,
			linear-gradient(145deg, #1e143a, #090625);
	}
	.module-placeholder::before,
	.module-placeholder::after {
		position: absolute;
		width: 48%;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 38%);
		content: '';
		transform: rotate(45deg);
		transition: transform 350ms ease;
	}
	.module-placeholder::after {
		width: 34%;
		border-style: dashed;
		transform: rotate(45deg) scale(0.9);
	}
	.module-card:hover .module-placeholder::before,
	.module-card:focus-visible .module-placeholder::before {
		transform: rotate(60deg);
	}
	.module-placeholder > span {
		z-index: 1;
		color: #fff;
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: clamp(42px, 7vw, 82px);
		text-shadow: 0 0 24px var(--module-accent);
	}
	.module-number,
	.module-category {
		position: absolute;
		z-index: 1;
		padding: 7px 10px;
		clip-path: polygon(0 0, 100% 0, 100% 66%, 88% 100%, 0 100%);
		background: rgba(18, 14, 53, 0.85);
		color: #e9dcff;
		font-size: 8px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.module-number {
		top: 13px;
		left: 12px;
		display: grid;
		width: 31px;
		height: 31px;
		place-items: center;
		border: 1px solid rgba(170, 116, 255, 0.48);
		border-radius: 50%;
		padding: 0;
	}
	.module-category {
		bottom: 12px;
		left: 12px;
		max-width: calc(100% - 65px);
		overflow: hidden;
		border: 1px solid rgba(170, 116, 255, 0.4);
		color: #e9dcff;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.module-open {
		position: absolute;
		top: 12px;
		right: 12px;
		display: grid;
		width: 36px;
		height: 36px;
		place-items: center;
		border: 1px solid rgba(214, 138, 255, 0.6);
		border-radius: 50%;
		background: rgba(18, 14, 53, 0.78);
		color: #fff;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 180ms,
			transform 180ms;
	}
	.module-card:hover .module-open,
	.module-card:focus-visible .module-open {
		opacity: 1;
		transform: translateY(0);
	}
	.module-caption {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 0 0;
		border-top: 1px solid transparent;
		transition: border-color 180ms;
	}
	.module-card:hover .module-caption,
	.module-card:focus-visible .module-caption {
		border-color: color-mix(in srgb, var(--module-accent), transparent 55%);
	}
	.module-caption h3 {
		margin: 0;
		color: #ece2ff;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 12px;
		line-height: 1.4;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.module-caption p {
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
	.caption-arrow {
		display: grid;
		width: 30px;
		height: 30px;
		flex: 0 0 auto;
		place-items: center;
		border: 1px solid var(--edge);
		border-radius: 50%;
		color: var(--accent);
		transition:
			color 180ms,
			background 180ms,
			transform 180ms;
	}
	.module-card:hover .caption-arrow,
	.module-card:focus-visible .caption-arrow {
		transform: translate(2px, -2px);
		border-color: transparent;
		background: linear-gradient(120deg, #7a33e0, #b455ff);
		color: #fff;
	}
	.empty-catalog {
		padding: 30px;
		border: 1px solid var(--edge);
		color: rgba(214, 200, 246, 0.78);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 14px;
		text-align: center;
	}
	.modules-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		margin-top: 45px;
		padding: 42px 0 76px;
		border-top: 1px solid var(--edge);
	}
	.modules-footer p {
		margin: 9px 0 0;
		color: #e2b6ff;
		font-family: 'Delicatus', 'Game Paused', sans-serif;
		font-size: clamp(22px, 2.4vw, 30px);
		letter-spacing: 0.03em;
	}
	.modules-footer > a {
		display: flex;
		align-items: center;
		gap: 14px;
		color: rgba(222, 208, 250, 0.85);
		font-size: 10px;
		letter-spacing: 0.18em;
		text-decoration: none;
		text-transform: uppercase;
	}
	.modules-page :is(a):focus-visible {
		outline: 2px solid #debaff;
		outline-offset: 6px;
	}
	@media (max-width: 1000px) {
		.modules-wrap {
			width: min(100% - 72px, 850px);
		}
		.modules-hero {
			grid-template-columns: 1fr 0.9fr;
			gap: 24px;
			padding-top: 145px;
		}
		.hero-montage {
			height: clamp(380px, 48vw, 520px);
		}
		.module-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 700px) {
		.modules-wrap {
			width: calc(100% - 40px);
		}
		.modules-hero {
			grid-template-columns: 1fr;
			gap: 12px;
			padding: 120px 0 44px;
		}
		.hero-copy {
			position: relative;
			z-index: 2;
		}
		h1 {
			margin: 24px 0 18px;
			font-size: clamp(50px, 12vw, 78px);
		}
		.hero-description {
			font-size: 13px;
		}
		.hero-description br {
			display: none;
		}
		.hero-facts {
			margin-top: 30px;
		}
		.hero-montage {
			width: min(100%, 500px);
			height: min(110vw, 460px);
			margin: 8px auto 0;
		}
		.montage-note {
			right: 0;
			font-size: 7px;
		}
		.neural-art {
			width: 150%;
			height: 130%;
		}
		.neural-label {
			right: 3%;
			bottom: 8%;
			font-size: 7px;
		}
		.frame-note {
			top: 0;
			font-size: 7px;
		}
		.archive-divider {
			gap: 12px;
			font-size: 7px;
			letter-spacing: 0.16em;
		}
		.collection {
			padding-top: 54px;
		}
		.collection-heading {
			align-items: start;
			flex-direction: column;
			gap: 14px;
		}
		.collection-instruction br {
			display: none;
		}
		.collection-toolbar {
			margin: 24px 0;
			padding-bottom: 17px;
		}
		.section-mark,
		.frame-count {
			font-size: 8px;
		}
		.module-grid {
			gap: 27px 14px;
		}
		.module-caption h3 {
			font-size: 10px;
			letter-spacing: 0.08em;
		}
		.module-caption p {
			font-size: 11px;
		}
		.module-category {
			font-size: 6px;
			letter-spacing: 0.08em;
		}
		.module-open {
			width: 31px;
			height: 31px;
			opacity: 1;
			transform: none;
		}
		.modules-footer {
			padding-bottom: 52px;
		}
	}
	@media (max-width: 420px) {
		.modules-wrap {
			width: calc(100% - 32px);
		}
		.eyebrow {
			gap: 7px;
			font-size: 8px;
			letter-spacing: 0.15em;
		}
		.collection-toolbar {
			align-items: flex-start;
			flex-direction: column;
			gap: 8px;
		}
		.module-grid {
			grid-template-columns: 1fr;
			gap: 25px;
		}
		.modules-footer {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.modules-page *,
		.modules-page *::before,
		.modules-page *::after {
			scroll-behavior: auto !important;
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
		}
	}
</style>
