<script lang="ts">
	import { resolve } from '$app/paths';
	import imgMod from '$lib/assets/Gallery.png';
	let { gifSrc = imgMod }: { gifSrc?: string } = $props();
</script>

<section class="modules">
	<div class="visual">
		<img src={gifSrc} alt="" />
		<h1 class="font-paused">GALLERY</h1>
	</div>
	<a href={resolve('/gallery')}>CHECK OUT <span aria-hidden="true">↗</span></a>
</section>

<style>
	.modules {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
		padding: 2rem 1rem;
		background: transparent;
		overflow: hidden;
	}

	.visual {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		max-width: 900px;
		aspect-ratio: 16 / 8;
	}

	.visual img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	h1 {
		position: relative;
		z-index: 1;
		margin: 0;
		color: #fff;
		font-size: clamp(3rem, 11vw, 8rem);
		font-weight: 900;
		letter-spacing: 0.06em;
		line-height: 0.85;
		text-align: center;
		text-shadow:
			0 0 15px #fff8,
			0 0 35px #a78bfa55;
	}

	a {
		display: inline-flex;
		padding: 0.65rem 2.2rem;
		align-items: center;
		color: #f8f5ff;
		font:
			700 clamp(0.78rem, 1.5vw, 0.92rem) 'BankGothic',
			sans-serif;
		letter-spacing: 0.12em;
		text-decoration: none;
		background: rgba(11, 12, 38, 0.45);
		border: 1px solid rgba(226, 213, 255, 0.7);
		clip-path: polygon(0 0, 94% 0, 100% 50%, 94% 100%, 0 100%);
		backdrop-filter: blur(8px);
		transition:
			transform 0.2s ease,
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	a:hover,
	a:focus-visible {
		transform: translateY(-2px);
		background: rgba(216, 188, 233, 0.18);
		border-color: #f0d7ef;
	}

	a:focus-visible {
		outline: 2px solid #f0d7ef;
		outline-offset: 4px;
	}

	a span {
		margin-left: 0.7rem;
	}

	@media (max-width: 600px) {
		.modules {
			gap: 1rem;
			padding: 1rem 0.5rem;
		}

		.visual {
			aspect-ratio: 5 / 3;
		}
	}
</style>
