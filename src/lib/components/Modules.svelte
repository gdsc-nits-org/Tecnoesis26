
<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
    import imgMod from '$lib/assets/moduleImg.png'

	let {
		gifSrc = imgMod,
		onExplore = () => {}
	}: { gifSrc?: string; onExplore?: MouseEventHandler<HTMLButtonElement> } = $props();
</script>

<section class="modules">
	<div class="visual">
		<img src={gifSrc} alt="" />
		<h1 class="font-paused">MODULES</h1>
	</div>
	<button onclick={onExplore}>CHECK OUT <span>↗</span></button>
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
		text-shadow: 0 0 15px #fff8, 0 0 35px #a78bfa55;
	}

	button {
		padding: 0.65rem 2.2rem;
		color: #090019;
		font: 700 clamp(0.85rem, 2vw, 1.2rem) 'Arial Black', sans-serif;
		letter-spacing: 0.02em;
		background: linear-gradient(135deg, #e5dfff, #8170d8);
		border: 2px solid #c8baff;
		clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
		cursor: pointer;
		transition: transform 0.25s, filter 0.25s;
	}

	button:hover {
		transform: scale(1.06);
		filter: brightness(1.2);
	}

	button span {
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
