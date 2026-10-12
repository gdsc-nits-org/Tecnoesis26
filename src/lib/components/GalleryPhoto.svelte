<script lang="ts">
	import type { GalleryPhoto } from '$lib/data/gallery';
	let {
		photo,
		eager = false,
		contained = false
	}: { photo: GalleryPhoto; eager?: boolean; contained?: boolean } = $props();
	let failedSource = $state<string | null>(null);
</script>

<picture class:contained class:failed={failedSource === photo.src}>
	<source media="(min-width: 2561px)" srcset={photo.sources.ultra} />
	<source media="(min-width: 1025px)" srcset={photo.sources.desktop} />
	<source media="(min-width: 769px)" srcset={photo.sources.tablet} />
	<img
		src={photo.sources.mobile}
		alt={`${photo.title} at Tecnoesis 2026`}
		width={photo.width}
		height={photo.height}
		loading={eager ? 'eager' : 'lazy'}
		fetchpriority={eager ? 'high' : 'auto'}
		decoding="async"
		onload={() => (failedSource = null)}
		onerror={() => (failedSource = photo.src)}
	/>
	{#if failedSource === photo.src}
		<span class="image-fallback">{photo.title}<small>Image unavailable</small></span>
	{/if}
</picture>

<style>
	picture {
		position: relative;
		display: block;
		width: 100%;
		background: #171321;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
	}
	.contained {
		height: 100%;
		background: transparent;
	}
	.contained img {
		height: 100%;
		object-fit: contain;
	}
	.failed img {
		opacity: 0;
	}
	.image-fallback {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 20px;
		color: #ddd0f1;
		font:
			16px/1.5 Arial,
			sans-serif;
	}
	.image-fallback small {
		color: #a29aa9;
		font-size: 12px;
	}
</style>
