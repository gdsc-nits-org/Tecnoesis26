<script lang="ts">
	import { Hero } from '$lib';
	import { About, SectionRail, Sponsors, Merch, Modules, Gallery } from '$lib/components';

	let { data } = $props();
</script>

<SectionRail />
<div data-section-name="TECNOESIS">
	<Hero />
</div>
<div data-section-name="ABOUT">
	<About />
</div>
<div data-section-name="MERCH">
	<Merch />
</div>
<div data-section-name="MODULES">
	<Modules />
</div>
<div data-section-name="GALLERY">
	<Gallery />
</div>
<div data-section-name="SPONSORS">
	<Sponsors sponsors={data.sponsors} />
</div>
