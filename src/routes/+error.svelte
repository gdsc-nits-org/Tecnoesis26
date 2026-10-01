<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const errorMessage = $derived(
		page.error?.message || 'The requested signal could not be resolved.'
	);
	const errorTitle = $derived.by(() => {
		if (status === 404) return 'SIGNAL LOST';
		if (status >= 400 && status < 500) return 'BAD REQUEST';
		if (status >= 500) return 'SYSTEM FAULT';
		return 'UNEXPECTED ERROR';
	});

	function goBack() {
		history.back();
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="error-page" aria-labelledby="error-title">
	<div class="error-grid" aria-hidden="true"></div>
	<div class="error-glow error-glow-one" aria-hidden="true"></div>
	<div class="error-glow error-glow-two" aria-hidden="true"></div>

	<section class="error-panel">
		<div class="error-meta">
			<span class="status-dot"></span>
			<span>TECNOESIS 2026 / SYSTEM MESSAGE</span>
			<span class="error-path">{page.url.pathname}</span>
		</div>

		<div class="error-code" aria-label={`Error ${status}`}>
			{String(status).padStart(3, '0')}
		</div>

		<div class="error-copy">
			<p class="eyebrow">Connection interrupted</p>
			<h1 id="error-title">{errorTitle}</h1>
			<p class="message">{errorMessage}</p>
			<p class="instruction">Return to the main channel or retrace your last route.</p>
		</div>

		<div class="error-actions">
			<a class="primary-action" href="/home">Return home <span aria-hidden="true">↗</span></a>
			<button class="secondary-action" type="button" onclick={goBack}
				>Go back <span aria-hidden="true">←</span></button
			>
		</div>
	</section>

	<div class="error-footer" aria-hidden="true">
		<span>ERROR HANDLER ONLINE</span>
		<span class="footer-line"></span>
		<span>TRY AGAIN / KEEP EXPLORING</span>
	</div>
</main>

<style>
	.error-page {
		position: relative;
		display: grid;
		min-height: 100svh;
		place-items: center;
		overflow: hidden;
		padding: 9rem 1.5rem 4rem;
		isolation: isolate;
		color: #f7f2ff;
		background:
			linear-gradient(180deg, rgba(22, 9, 36, 0.18), rgba(76, 26, 115, 0.3)),
			url('/background.jpg') center / cover fixed;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
	}

	.error-page::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(180deg, rgba(4, 3, 24, 0.16), rgba(4, 3, 24, 0.82));
		content: '';
	}

	.error-grid {
		position: absolute;
		inset: 0;
		z-index: -1;
		background-image:
			linear-gradient(rgba(216, 160, 255, 0.07) 1px, transparent 1px),
			linear-gradient(90deg, rgba(216, 160, 255, 0.07) 1px, transparent 1px);
		background-size: 72px 72px;
		mask-image: linear-gradient(90deg, transparent, #000 24%, #000 76%, transparent);
		opacity: 0.45;
	}

	.error-glow {
		position: absolute;
		z-index: -1;
		border-radius: 50%;
		filter: blur(5px);
		pointer-events: none;
	}

	.error-glow-one {
		top: 12%;
		left: 12%;
		width: 18rem;
		height: 18rem;
		background: rgba(155, 70, 255, 0.22);
	}

	.error-glow-two {
		right: 9%;
		bottom: 8%;
		width: 24rem;
		height: 24rem;
		background: rgba(73, 193, 255, 0.1);
	}

	.error-panel {
		width: min(100%, 760px);
		padding: clamp(1.5rem, 5vw, 4rem);
		border: 1px solid rgba(216, 160, 255, 0.4);
		clip-path: polygon(
			0 14px,
			14px 0,
			calc(100% - 14px) 0,
			100% 14px,
			100% calc(100% - 14px),
			calc(100% - 14px) 100%,
			14px 100%,
			0 calc(100% - 14px)
		);
		background: rgba(9, 6, 45, 0.68);
		box-shadow:
			0 0 55px rgba(142, 67, 255, 0.2),
			inset 0 0 50px rgba(142, 67, 255, 0.06);
		backdrop-filter: blur(12px);
	}

	.error-meta,
	.error-footer {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: rgba(220, 210, 244, 0.62);
		font-size: 0.62rem;
		letter-spacing: 0.18em;
		line-height: 1.5;
		text-transform: uppercase;
	}

	.status-dot {
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: #d8a0ff;
		box-shadow: 0 0 14px #d8a0ff;
	}

	.error-path {
		margin-left: auto;
		max-width: 40%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		opacity: 0.55;
	}

	.error-code {
		margin: clamp(2.5rem, 8vw, 5.5rem) 0 0;
		color: rgba(216, 160, 255, 0.16);
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: clamp(5rem, 22vw, 12rem);
		line-height: 0.75;
		letter-spacing: 0.03em;
		text-shadow: 0 0 35px rgba(216, 160, 255, 0.22);
	}

	.error-copy {
		position: relative;
		margin-top: -0.2rem;
	}

	.eyebrow {
		margin: 0 0 0.65rem;
		color: #d8a0ff;
		font-size: 0.68rem;
		letter-spacing: 0.23em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		font-family: 'Game Paused', 'GameDemo', sans-serif;
		font-size: clamp(2.25rem, 7vw, 5rem);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.message {
		max-width: 48ch;
		margin: 1.5rem 0 0;
		color: rgba(247, 242, 255, 0.88);
		font-size: clamp(0.9rem, 1.7vw, 1.05rem);
		line-height: 1.7;
	}

	.instruction {
		margin: 0.55rem 0 0;
		color: rgba(220, 210, 244, 0.55);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
	}

	.error-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 2rem;
	}

	.primary-action,
	.secondary-action {
		min-height: 2.8rem;
		padding: 0.75rem 1.1rem;
		border: 1px solid rgba(216, 160, 255, 0.56);
		border-radius: 0;
		font: inherit;
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-decoration: none;
		text-transform: uppercase;
		cursor: pointer;
		transition: 180ms ease;
	}

	.primary-action {
		color: #16082d;
		background: linear-gradient(120deg, #f0c5ff, #a66bff);
	}

	.secondary-action {
		color: #f7f2ff;
		background: rgba(216, 160, 255, 0.08);
	}

	.primary-action:hover,
	.secondary-action:hover {
		border-color: #fff;
		box-shadow: 0 0 22px rgba(216, 160, 255, 0.28);
		transform: translateY(-2px);
	}

	.primary-action:focus-visible,
	.secondary-action:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 4px;
	}

	.error-footer {
		position: absolute;
		right: clamp(1.5rem, 5vw, 4rem);
		bottom: 1.5rem;
		left: clamp(1.5rem, 5vw, 4rem);
	}

	.footer-line {
		height: 1px;
		flex: 1;
		background: linear-gradient(90deg, transparent, rgba(216, 160, 255, 0.5), transparent);
	}

	@media (max-width: 600px) {
		.error-page {
			padding: 7rem 1rem 5rem;
		}

		.error-meta,
		.error-footer {
			font-size: 0.52rem;
			letter-spacing: 0.1em;
		}

		.error-path,
		.error-footer :last-child {
			display: none;
		}

		.error-footer {
			left: 1rem;
		}
	}
</style>
