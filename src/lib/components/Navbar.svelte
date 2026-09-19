<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{ name: 'HOME', href: '/home' },
		{ name: 'GALLERY', href: '/events' },
		{ name: 'MODULE', href: '/module' },
		{ name: 'SPARK', href: '/spark' },
		{ name: 'TEAMS', href: '/team' }
	];

	function isActive(href: string) {
		const pathname = page.url.pathname;

		if (href === '/home') {
			return pathname === '/home';
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	}
</script>

<header
	class="absolute left-0 top-0 z-50 flex h-24 w-full items-center px-10"
>
	<!-- NAVIGATION -->
	<nav>
		<ul class="flex items-center gap-8">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class="group relative block pb-2 text-[11px] font-semibold tracking-[0.22em]"
					>
						{item.name}

						<!-- Active / hover underline -->
						<span
							class={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ease-out ${
								isActive(item.href)
									? 'w-full'
									: 'w-0 group-hover:w-full'
							}`}
						></span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- LOGIN -->
	<a
		href="/auth/login"
		class="group relative ml-auto flex items-center gap-3 overflow-hidden rounded-full border border-white/40 px-5 py-2.5 text-[10px] font-semibold tracking-[0.2em] transition-all duration-300 hover:border-white"
	>
		<!-- Hover background -->
		<span
			class="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
		></span>

		<span class="relative z-10 transition-colors duration-300 group-hover:text-black">
			LOGIN
		</span>

		<span
			class="relative z-10 flex h-4 w-4 items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:text-black"
		>
			→
		</span>
	</a>
</header>