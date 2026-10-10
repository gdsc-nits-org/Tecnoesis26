<script lang="ts">
	import { modules } from '$lib/data/modules';
</script>

<svelte:head>
	<title>Modules | Tecnoesis 2026</title>
	<meta name="description" content="Explore the modules and events at Tecnoesis 2026." />
</svelte:head>

<main class="module-index">
	<section class="module-hero" aria-labelledby="modules-title">
		<div class="hero-orbit" aria-hidden="true"></div>
		<img class="hero-art" src="/modules_bg.svg" alt="" />
		<div class="hero-copy">
			<p class="eyebrow">TECNOESIS 2026 <span>·</span> EVENT UNIVERSE</p>
			<h1 id="modules-title">MODULES</h1>
			<p class="hero-caption">Twenty worlds. One festival.</p>
		</div>
		<div class="hero-index" aria-hidden="true"><span>01</span><i></i><span>20</span></div>
	</section>

	<section class="catalog" aria-label="Festival modules">
		<header class="catalog-heading">
			<div>
				<span class="section-mark">A / 20</span>
				<h2>Choose your arena</h2>
			</div>
			<p>Explore a module to find its events</p>
		</header>

		<div class="module-grid">
			{#each modules as module, index}
				<a
					class="module-card"
					class:offset-card={index % 4 === 1 || index % 4 === 2}
					style={`--card-accent:${module.accent};--card-order:${index}`}
					href={`/modules/${module.slug}`}
				>
					<div class="card-art" aria-hidden="true">
						<span class="card-number">{String(index + 1).padStart(2, '0')}</span>
						<span class="card-glyph">{String(index + 1).padStart(2, '0')}</span>
						<span class="card-cross">+</span>
					</div>
					<div class="card-footer">
						<div>
							<span class="card-kicker">{module.kicker}</span>
							<h3>{module.name}</h3>
						</div>
						<span class="card-arrow" aria-hidden="true">↗</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.module-index {
		--ink: #f5edff;
		--muted: #c3acd8;
		--line: rgba(238, 215, 255, 0.34);
		min-height: 100vh;
		padding: 118px clamp(20px, 6vw, 90px) 100px;
		color: var(--ink);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
	}

	.module-hero {
		position: relative;
		display: grid;
		min-height: min(64vh, 590px);
		place-items: center;
		isolation: isolate;
		overflow: hidden;
		border-bottom: 1px solid var(--line);
	}

	.hero-art {
		position: absolute;
		z-index: -2;
		inset: -12% 4% -12%;
		width: 92%;
		height: 124%;
		object-fit: contain;
		opacity: 0.7;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.hero-orbit {
		position: absolute;
		z-index: -1;
		width: min(66vw, 730px);
		aspect-ratio: 1;
		border: 1px solid rgba(224, 171, 255, 0.23);
		border-radius: 50%;
		box-shadow:
			0 0 0 42px rgba(224, 171, 255, 0.035),
			0 0 0 84px rgba(224, 171, 255, 0.025);
	}

	.hero-copy {
		z-index: 1;
		padding: 24px 0;
		text-align: center;
	}

	.eyebrow,
	.hero-caption,
	.catalog-heading p,
	.card-kicker {
		margin: 0;
		font-family: 'Sulphur Point', sans-serif;
	}

	.eyebrow {
		color: #f1d9ff;
		font-size: 0.78rem;
		letter-spacing: 0.18em;
	}

	.eyebrow span {
		padding-inline: 0.4rem;
		color: #f1a5e7;
	}

	h1 {
		margin: 0.08em 0 0;
		color: #f0e7ff;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: clamp(4rem, 14vw, 12.5rem);
		font-weight: 900;
		line-height: 0.95;
		-webkit-text-stroke: 2px #f0e7ff;
		text-shadow:
			8px 7px 0 #7427c7,
			0 0 32px rgba(207, 129, 255, 0.46);
	}

	.hero-caption {
		margin-top: 1.2rem;
		color: #e1c9f4;
		font-size: clamp(1rem, 2vw, 1.35rem);
	}

	.hero-index {
		position: absolute;
		right: 2%;
		bottom: 34px;
		display: flex;
		align-items: center;
		gap: 10px;
		color: #f2dfff;
		font-size: 0.72rem;
	}

	.hero-index i {
		width: 62px;
		height: 1px;
		background: linear-gradient(90deg, #dfb9ff, transparent);
	}

	.catalog {
		max-width: 1420px;
		margin-inline: auto;
		padding-top: 56px;
	}

	.catalog-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 28px;
	}

	.catalog-heading > div {
		display: flex;
		align-items: baseline;
		gap: 16px;
	}

	.section-mark {
		color: #e7aaff;
		font-size: 0.7rem;
	}

	h2 {
		margin: 0;
		font-size: clamp(1.25rem, 2.5vw, 2rem);
		font-weight: 500;
	}

	.catalog-heading p {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.module-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 22px 18px;
	}

	.module-card {
		position: relative;
		display: flex;
		min-width: 0;
		min-height: 252px;
		flex-direction: column;
		justify-content: space-between;
		padding: 3px;
		clip-path: polygon(0 8%, 8% 0, 82% 0, 100% 19%, 100% 100%, 13% 100%, 0 87%);
		background: color-mix(in srgb, var(--card-accent), transparent 26%);
		color: var(--ink);
		text-decoration: none;
		transition:
			transform 240ms ease,
			filter 240ms ease;
	}

	.module-card.offset-card {
		transform: translateY(14px);
	}

	.module-card:hover,
	.module-card:focus-visible {
		z-index: 1;
		filter: drop-shadow(0 0 16px color-mix(in srgb, var(--card-accent), transparent 28%));
		transform: translateY(-5px);
	}

	.module-card.offset-card:hover,
	.module-card.offset-card:focus-visible {
		transform: translateY(2px);
	}

	.module-card:focus-visible {
		outline: 2px solid white;
		outline-offset: 5px;
	}

	.card-art,
	.card-footer {
		position: relative;
		clip-path: polygon(0 8%, 8% 0, 82% 0, 100% 19%, 100% 100%, 13% 100%, 0 87%);
	}

	.card-art {
		display: grid;
		min-height: 150px;
		flex: 1;
		place-items: center;
		overflow: hidden;
		background:
			radial-gradient(
				circle at 50% 48%,
				color-mix(in srgb, var(--card-accent), transparent 65%),
				transparent 37%
			),
			radial-gradient(circle, rgba(244, 222, 255, 0.27) 1px, transparent 1.6px) 0 0 / 13px 13px,
			linear-gradient(145deg, rgba(37, 11, 66, 0.75), rgba(12, 8, 35, 0.94));
	}

	.card-art::before,
	.card-art::after {
		position: absolute;
		width: 68%;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--card-accent), transparent 35%);
		content: '';
		transform: rotate(45deg) skew(8deg, 8deg);
	}

	.card-art::after {
		width: 48%;
		border-style: dashed;
		transform: rotate(45deg) skew(-8deg, -8deg);
	}

	.card-number,
	.card-cross {
		position: absolute;
		z-index: 1;
		color: var(--card-accent);
		font-family: 'Sulphur Point', sans-serif;
	}

	.card-number {
		top: 20px;
		left: 22px;
		font-size: 0.75rem;
	}

	.card-cross {
		right: 23px;
		bottom: 18px;
		font-size: 1.5rem;
	}

	.card-glyph {
		z-index: 1;
		color: #fff;
		font-size: clamp(2.6rem, 5vw, 4.2rem);
		font-weight: 900;
		text-shadow: 0 0 24px var(--card-accent);
		transform: skew(-8deg);
	}

	.card-footer {
		display: flex;
		min-height: 82px;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 13px 18px 12px 20px;
		background: linear-gradient(110deg, rgba(199, 176, 242, 0.98), rgba(237, 218, 255, 0.96));
		color: #190c2c;
	}

	.card-kicker {
		display: block;
		margin-bottom: 5px;
		color: #50386a;
		font-size: 0.6rem;
		letter-spacing: 0.08em;
	}

	h3 {
		margin: 0;
		font-size: clamp(0.88rem, 1.25vw, 1.1rem);
		font-weight: 700;
		line-height: 1.15;
	}

	.card-arrow {
		flex: 0 0 auto;
		color: #5715a0;
		font-family: sans-serif;
		font-size: 1.35rem;
		transition: transform 180ms ease;
	}

	.module-card:hover .card-arrow,
	.module-card:focus-visible .card-arrow {
		transform: translate(3px, -3px);
	}

	@media (max-width: 960px) {
		.module-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.module-card.offset-card {
			transform: none;
		}
	}

	@media (max-width: 650px) {
		.module-index {
			padding: 95px 16px 76px;
		}
		.module-hero {
			min-height: 52vh;
		}
		.hero-art {
			inset: 0 -22%;
			width: 144%;
			height: 100%;
		}
		.hero-orbit {
			width: 92vw;
		}
		h1 {
			font-size: clamp(3rem, 15vw, 6rem);
			-webkit-text-stroke-width: 1px;
			text-shadow:
				4px 4px 0 #7427c7,
				0 0 22px rgba(207, 129, 255, 0.46);
		}
		.eyebrow {
			font-size: 0.62rem;
		}
		.catalog {
			padding-top: 34px;
		}
		.catalog-heading {
			align-items: start;
			flex-direction: column;
			gap: 8px;
		}
		.module-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 14px 10px;
		}
		.module-card {
			min-height: 202px;
		}
		.card-art {
			min-height: 118px;
		}
		.card-footer {
			min-height: 72px;
			padding: 10px 12px;
		}
		.card-kicker {
			font-size: 0.49rem;
		}
		h3 {
			font-size: 0.82rem;
		}
	}

	@media (max-width: 380px) {
		.module-grid {
			grid-template-columns: 1fr;
		}
		.module-card {
			min-height: 220px;
		}
	}
</style>
