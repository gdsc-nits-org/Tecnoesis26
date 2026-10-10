<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.module.name} | Tecnoesis 2026 Modules</title>
</svelte:head>

<main class="module-detail" style={`--module-accent:${data.module.accent}`}>
	<nav class="breadcrumbs" aria-label="Breadcrumb">
		<a href="/modules">Modules</a><span aria-hidden="true">/</span><span>{data.module.name}</span>
	</nav>
	<header class="module-heading">
		<p class="kicker">{data.module.kicker}</p>
		<h1>{data.module.name}</h1>
		<p class="description">{data.module.description}</p>
		<div class="module-meta">
			<span>MODULE {String(data.moduleIndex + 1).padStart(2, '0')}</span><i></i><span
				>{data.module.events.length} EVENTS</span
			>
		</div>
	</header>
	<section class="events" aria-labelledby="events-title">
		<div class="events-heading">
			<h2 id="events-title">Enter the events</h2>
			<span>SELECT A CHALLENGE <b>↘</b></span>
		</div>
		<div class="event-list">
			{#each data.module.events as event, index}
				<a class="event-card" href={`/modules/${data.module.slug}/${event.slug}`}>
					<span class="event-index">0{index + 1}</span>
					<span class="event-copy"
						><span class="event-label">EVENT / {data.module.name.toUpperCase()}</span><strong
							>{event.name}</strong
						><span class="event-description">{event.description}</span></span
					>
					<span class="event-arrow" aria-hidden="true">↗</span>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.module-detail {
		min-height: 100vh;
		padding: 126px clamp(20px, 9vw, 140px) 100px;
		color: #f5edff;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
	}
	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #cfb7e6;
		font:
			0.88rem 'Sulphur Point',
			sans-serif;
	}
	.breadcrumbs a {
		color: #e9c9ff;
		text-decoration: none;
	}
	.breadcrumbs a:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.module-heading {
		position: relative;
		max-width: 1000px;
		padding: clamp(48px, 9vw, 108px) 0 48px;
		border-bottom: 1px solid rgba(238, 215, 255, 0.3);
	}
	.module-heading::after {
		position: absolute;
		top: 48px;
		right: 5%;
		width: clamp(120px, 24vw, 270px);
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 38%);
		border-radius: 50%;
		box-shadow:
			0 0 0 24px rgba(228, 202, 255, 0.04),
			inset 0 0 40px color-mix(in srgb, var(--module-accent), transparent 84%);
		content: '';
		pointer-events: none;
	}
	.kicker,
	.module-meta,
	.events-heading > span,
	.event-label {
		color: var(--module-accent);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
	}
	.module-heading h1 {
		position: relative;
		z-index: 1;
		max-width: 850px;
		margin: 16px 0;
		font-size: clamp(3rem, 9vw, 8rem);
		font-weight: 800;
		line-height: 0.98;
		overflow-wrap: anywhere;
		text-shadow: 0 0 28px color-mix(in srgb, var(--module-accent), transparent 68%);
	}
	.description {
		max-width: 590px;
		margin: 20px 0 28px;
		color: #e3d1f1;
		font:
			clamp(1rem, 2vw, 1.2rem)/1.55 'Sulphur Point',
			sans-serif;
	}
	.module-meta {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.module-meta i {
		width: 46px;
		height: 1px;
		background: var(--module-accent);
		opacity: 0.7;
	}
	.events {
		max-width: 1000px;
		padding-top: 44px;
	}
	.events-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 17px;
	}
	.events-heading h2 {
		margin: 0;
		font-size: clamp(1.35rem, 3vw, 2rem);
		font-weight: 500;
	}
	.events-heading > span {
		font-family: 'Sulphur Point', sans-serif;
	}
	.events-heading b {
		padding-left: 8px;
		font-size: 1rem;
	}
	.event-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}
	.event-card {
		position: relative;
		display: grid;
		min-height: 184px;
		grid-template-columns: 44px 1fr 24px;
		gap: 16px;
		align-items: start;
		padding: 26px 24px;
		border: 1px solid color-mix(in srgb, var(--module-accent), transparent 58%);
		clip-path: polygon(0 0, 92% 0, 100% 15%, 100% 100%, 8% 100%, 0 86%);
		background: linear-gradient(135deg, rgba(90, 49, 126, 0.46), rgba(17, 10, 41, 0.62));
		color: #fff;
		text-decoration: none;
		transition:
			transform 180ms ease,
			background 180ms ease,
			box-shadow 180ms ease;
	}
	.event-card:hover,
	.event-card:focus-visible {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--module-accent), #29133e 76%),
			rgba(17, 10, 41, 0.78)
		);
		box-shadow: 0 0 24px color-mix(in srgb, var(--module-accent), transparent 80%);
		transform: translateY(-4px);
	}
	.event-card:focus-visible {
		outline: 2px solid var(--module-accent);
		outline-offset: 4px;
	}
	.event-index {
		color: var(--module-accent);
		font-size: 0.8rem;
	}
	.event-copy {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.event-label {
		font-size: 0.62rem;
	}
	.event-copy strong {
		font-size: clamp(1.05rem, 2vw, 1.5rem);
		font-weight: 600;
	}
	.event-description {
		color: #d4c0e4;
		font:
			0.96rem/1.45 'Sulphur Point',
			sans-serif;
	}
	.event-arrow {
		justify-self: end;
		color: var(--module-accent);
		font: 1.4rem sans-serif;
	}
	@media (max-width: 700px) {
		.module-detail {
			padding: 105px 20px 76px;
		}
		.module-heading::after {
			top: 72px;
			right: 1%;
			opacity: 0.5;
		}
		.event-list {
			grid-template-columns: 1fr;
		}
		.events-heading {
			align-items: start;
			flex-direction: column;
			gap: 8px;
		}
	}
</style>
