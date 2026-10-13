<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.event.name} | {data.module.name} | Tecnoesis 2026</title>
</svelte:head>

<main class="event-detail" style={`--event-accent:${data.module.accent}`}>
	{#if data.event.posterImage || data.event.bannerImage}
		<img
			class="page-backdrop"
			src={data.event.posterImage ?? data.event.bannerImage ?? ''}
			alt=""
			aria-hidden="true"
		/>
	{/if}
	<div class="page-backdrop-shade" aria-hidden="true"></div>
	<nav class="breadcrumbs" aria-label="Breadcrumb">
		<a href={resolve('/modules')}>Modules</a><span aria-hidden="true">/</span><a
			href={resolve(`/modules/${data.module.slug}`)}>{data.module.name}</a
		><span aria-hidden="true">/</span><span>{data.event.name}</span>
	</nav>
	<section class="event-hero">
		{#if data.event.posterImage || data.event.bannerImage}
			<div class="event-poster-frame" aria-hidden="true">
				<img src={data.event.posterImage ?? data.event.bannerImage ?? ''} alt="" />
			</div>
		{/if}
		<div class="event-orbit" aria-hidden="true"><span></span></div>
		<p class="event-kicker">
			{data.module.kicker} <span>·</span> EVENT {data.module.name.toUpperCase()}
		</p>
		<h1>{data.event.name}</h1>
		<p class="event-summary">{data.event.description}</p>
		<div class="event-mark"><span>TECNOESIS</span><i></i><span>2026</span></div>
	</section>
	{#if data.event.venue || data.event.registrationEndTime || data.event.prizeDescription || data.event.stagesDescription}
		<section class="event-information" aria-label="Event information">
			{#if data.event.venue}
				<div>
					<span>VENUE</span>
					<p>{data.event.venue}</p>
				</div>
			{/if}
			<div>
				<span>TEAM SIZE</span>
				<p>{data.event.minTeamSize}–{data.event.maxTeamSize} participants</p>
			</div>
			{#if data.event.registrationEndTime}
				<div>
					<span>REGISTRATION ENDS</span>
					<p>
						<time datetime={data.event.registrationEndTime}>{data.event.registrationEndTime}</time>
					</p>
				</div>
			{/if}
			{#if data.event.prizeDescription}
				<div>
					<span>PRIZES</span>
					<p>{data.event.prizeDescription}</p>
				</div>
			{/if}
			{#if data.event.stagesDescription}
				<div>
					<span>STAGES</span>
					<p>{data.event.stagesDescription}</p>
				</div>
			{/if}
		</section>
	{/if}
	<div class="event-actions">
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			class="register-link"
			href={`${resolve('/modules')}/${data.module.slug}/${data.event.slug}/participate`}
		>
			REGISTER NOW <span aria-hidden="true">↗</span>
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		<a class="back-link" href={resolve(`/modules/${data.module.slug}`)}
			><span aria-hidden="true">←</span> BACK TO {data.module.name.toUpperCase()} EVENTS</a
		>
	</div>
</main>

<style>
	.event-detail {
		position: relative;
		isolation: isolate;
		min-height: 100vh;
		padding: 126px clamp(20px, 9vw, 140px) 90px;
		color: #f5edff;
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
	.event-detail > :not(.page-backdrop):not(.page-backdrop-shade) {
		position: relative;
		z-index: 1;
	}
	.breadcrumbs {
		display: flex;
		flex-wrap: wrap;
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
	.event-hero {
		position: relative;
		display: flex;
		min-height: min(68vh, 650px);
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		isolation: isolate;
		overflow: hidden;
	}
	.event-poster-frame {
		position: absolute;
		z-index: 0;
		top: 50%;
		right: clamp(0px, 4vw, 60px);
		width: clamp(220px, 36vw, 480px);
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
		background: rgba(9, 6, 37, 0.2);
		box-shadow: 0 24px 75px rgba(3, 2, 22, 0.38);
		opacity: 0.88;
		transform: translateY(-50%) rotate(3deg);
	}
	.event-poster-frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.event-orbit {
		position: absolute;
		z-index: -1;
		top: 50%;
		right: clamp(10px, 10vw, 150px);
		display: grid;
		width: clamp(200px, 35vw, 440px);
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--event-accent), transparent 34%);
		border-radius: 50%;
		box-shadow:
			0 0 0 34px rgba(232, 208, 255, 0.035),
			0 0 0 68px rgba(232, 208, 255, 0.025);
		transform: translateY(-50%);
	}
	.event-orbit span {
		width: 58%;
		aspect-ratio: 1;
		border: 1px dashed color-mix(in srgb, var(--event-accent), transparent 28%);
		border-radius: 50%;
		box-shadow: 0 0 45px color-mix(in srgb, var(--event-accent), transparent 78%);
	}
	.event-kicker {
		position: relative;
		z-index: 1;
		color: var(--event-accent);
		font-size: 0.74rem;
		letter-spacing: 0.1em;
	}
	.event-kicker span {
		padding-inline: 8px;
	}
	.event-hero h1 {
		position: relative;
		z-index: 1;
		max-width: 900px;
		margin: 16px 0;
		font-size: clamp(3.25rem, 10vw, 9rem);
		font-weight: 800;
		line-height: 0.95;
		overflow-wrap: anywhere;
		text-shadow: 0 0 34px color-mix(in srgb, var(--event-accent), transparent 70%);
	}
	.event-summary {
		position: relative;
		z-index: 1;
		max-width: 550px;
		color: #e3d1f1;
		font:
			clamp(1.05rem, 2.1vw, 1.3rem)/1.55 'Sulphur Point',
			sans-serif;
	}
	.event-mark {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 28px;
		color: var(--event-accent);
		font-size: 0.68rem;
		letter-spacing: 0.12em;
	}
	.event-mark i {
		width: 54px;
		height: 1px;
		background: var(--event-accent);
	}
	.event-information {
		display: grid;
		max-width: 900px;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
		gap: 18px 28px;
		margin: 0 0 34px;
		padding: 24px;
		border: 1px solid color-mix(in srgb, var(--event-accent), transparent 68%);
		background: rgba(17, 10, 41, 0.48);
	}
	.event-information > div > span {
		color: var(--event-accent);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
	}
	.event-information p {
		margin: 8px 0 0;
		color: #e3d1f1;
		font:
			1rem/1.45 'Sulphur Point',
			sans-serif;
		white-space: pre-line;
	}
	.event-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px;
	}
	.register-link {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 15px;
		padding: 12px 23px;
		clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 6% 50%);
		background: #e8d8ff;
		color: #210b3c;
		font-size: 0.78rem;
		text-decoration: none;
		transition:
			transform 180ms ease,
			background-color 180ms ease,
			box-shadow 180ms ease;
	}
	.register-link span {
		font: 1.15rem sans-serif;
	}
	.register-link:hover,
	.register-link:focus-visible {
		background: #fff;
		box-shadow: 0 0 22px color-mix(in srgb, var(--event-accent), transparent 54%);
		transform: translateY(-2px);
	}
	.register-link:focus-visible {
		outline: 2px solid var(--event-accent);
		outline-offset: 4px;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 11px;
		padding: 14px 22px;
		border: 1px solid color-mix(in srgb, var(--event-accent), transparent 34%);
		clip-path: polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%);
		color: #fff;
		font-size: 0.77rem;
		text-decoration: none;
		transition:
			background 180ms ease,
			transform 180ms ease;
	}
	.back-link:hover,
	.back-link:focus-visible {
		background: color-mix(in srgb, var(--event-accent), transparent 84%);
		transform: translateX(-3px);
	}
	.back-link:focus-visible {
		outline: 2px solid var(--event-accent);
		outline-offset: 4px;
	}
	.back-link span {
		font: 1.15rem sans-serif;
	}
	@media (max-width: 650px) {
		.event-detail {
			padding: 105px 20px 80px;
		}
		.event-hero {
			min-height: 60vh;
		}
		.event-orbit {
			right: -25%;
			opacity: 0.55;
		}
		.event-poster-frame {
			right: -12%;
			width: min(65vw, 310px);
			opacity: 0.48;
		}
		.event-kicker {
			max-width: 75%;
			line-height: 1.7;
		}
	}
</style>
