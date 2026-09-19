<script lang="ts">
	const navItems = ['Home', 'Gallery', 'Modules', 'Spark', 'Teams'];
</script>

<nav class="flex flex-1 items-center justify-between gap-8" aria-label="Main navigation">
	<div class="font-nav flex items-center gap-8 text-[1.1rem] font-semibold text-white/80 opacity-95">
		{#each navItems as item}
			<a
				href="/"
				class={`relative inline-flex items-center justify-center text-white/80 no-underline ${item === 'Home' ? "after:absolute after:bottom-[-0.5rem] after:left-0 after:right-0 after:h-0.5 after:bg-white/90" : ''}`}
			>
				{item}
			</a>
		{/each}
	</div>
	<button class="font-nav cursor-pointer border-0 bg-transparent px-3 py-2 text-[1.1rem] font-semibold text-white/90" type="button">Login</button>
</nav>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Sulphur+Point:wght@300;400;700&display=swap');

</style>