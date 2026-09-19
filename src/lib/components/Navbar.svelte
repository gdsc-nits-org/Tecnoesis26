<script lang="ts">
	const navItems = [
		{ name: 'HOME', href: '/home' },
		{ name: 'GALLERY', href: '/events' },
		{ name: 'MODULE', href: '/module' },
		{ name: 'SPARK', href: '/spark' },
		{ name: 'TEAMS', href: '/team' }
	];
</script>

<header
	class="fixed left-0 top-0 z-50 flex h-24 w-full items-center px-8 text-white"
>
	<!-- LEFT SECTION -->
	<div class="flex h-full items-center">
		<!-- Vertical TECNOESIS text -->
		<div
			class="flex h-full w-10 items-center justify-center border-r border-white/20"
		>
			<div
				class="rotate-180 text-xs font-bold tracking-[0.35em]"
				style="writing-mode: vertical-rl;"
			>
				TECNOESIS
			</div>
		</div>

		<!-- Navigation immediately after vertical text -->
		<nav class="ml-6">
			<ul class="flex items-center gap-7">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class="text-xs font-semibold tracking-[0.2em] transition-opacity duration-200 hover:opacity-60"
						>
							{item.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<!-- MAIN LOGO -->
	<div class="ml-auto flex items-center">
		<a href="/home" aria-label="Tecnoesis home">
			<img
				src="/no glow logo.svg"
				alt="Tecnoesis"
				class="h-14 w-auto"
			/>
		</a>
	</div>
</header>