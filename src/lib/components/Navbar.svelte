<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let menuOpen = $state(false);
</script>

<header class="bg-transparent max-[700px]:relative max-[700px]:z-20">
	<nav
		class:menu-open={menuOpen}
		class="relative z-999 flex items-center overflow-visible font-game-demo text-[#3b3b3b] min-[701px]:min-h-[90px] min-[701px]:pr-[clamp(24px,5vw,72px)] min-[701px]:pl-[clamp(24px,17vw,200px)] max-[700px]:min-h-[46px] max-[700px]:flex-wrap max-[700px]:rounded-none max-[700px]:border-0 max-[700px]:bg-[rgba(5,5,5,0.22)] max-[700px]:[background-image:none] max-[700px]:p-0 max-[700px]:backdrop-blur-[3px] max-[700px]:[&.menu-open]:border-b max-[700px]:[&.menu-open]:border-white max-[700px]:[&.menu-open]:bg-black"
		aria-label="Main navigation"
	>
		<button
			class="hidden cursor-pointer border-0 bg-transparent max-[700px]:relative max-[700px]:grid max-[700px]:h-[46px] max-[700px]:w-[61px] max-[700px]:content-center max-[700px]:gap-1 max-[700px]:border-r max-[700px]:border-r-[rgba(255,255,255,0.25)] max-[700px]:px-[15px] max-[700px]:py-2"
			type="button"
			aria-label="Toggle navigation"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span
				class="block h-0.5 w-5 bg-white transition-[transform,opacity] duration-150"
				class:translate-y-[6px]={menuOpen}
				class:rotate-45={menuOpen}
			></span><span
				class="block h-0.5 w-5 bg-white transition-[transform,opacity] duration-150"
				class:opacity-0={menuOpen}
			></span><span
				class="block h-0.5 w-5 bg-white transition-[transform,opacity] duration-150"
				class:-translate-y-[6px]={menuOpen}
				class:-rotate-45={menuOpen}
			></span>
		</button>

		<div
			class:menu-open={menuOpen}
			class="flex flex-1 items-center justify-start gap-[clamp(20px,3vw,35px)] max-[700px]:pointer-events-none max-[700px]:invisible max-[700px]:fixed max-[700px]:inset-x-0 max-[700px]:top-[46px] max-[700px]:z-30 max-[700px]:flex max-[700px]:h-[calc(100dvh-46px)] max-[700px]:w-screen max-[700px]:flex-col max-[700px]:items-start max-[700px]:justify-start max-[700px]:gap-[17px] max-[700px]:bg-black max-[700px]:p-[84px_32px_40px] max-[700px]:opacity-0 max-[700px]:transition-[clip-path,opacity,visibility] max-[700px]:duration-[560ms] max-[700px]:ease-[cubic-bezier(0.22,1,0.36,1)] max-[700px]:[clip-path:inset(0_100%_0_0)] max-[700px]:[&.menu-open]:pointer-events-auto max-[700px]:[&.menu-open]:visible max-[700px]:[&.menu-open]:opacity-100 max-[700px]:[&.menu-open]:[clip-path:inset(0_0_0_0)] max-[700px]:[&.menu-open_a]:[transform:translateX(0)] max-[700px]:[&.menu-open_a]:opacity-100 max-[700px]:[&.menu-open_a.active]:w-[min(280px,73vw)] max-[700px]:[&.menu-open_a.active]:bg-[#29248c] max-[700px]:[&.menu-open_a.active]:[clip-path:polygon(0_0,100%_0,100%_68%,90%_100%,0_100%)] max-[700px]:[&.menu-open_a:nth-child(1)]:[transition-delay:120ms] max-[700px]:[&.menu-open_a:nth-child(2)]:[transition-delay:180ms] max-[700px]:[&.menu-open_a:nth-child(3)]:[transition-delay:240ms] max-[700px]:[&.menu-open_a:nth-child(4)]:[transition-delay:300ms] max-[700px]:[&.menu-open_a:nth-child(5)]:[transition-delay:360ms] [&>a.active::after]:[transform:scaleX(1)] [&>a::after]:absolute [&>a::after]:right-0 [&>a::after]:bottom-[-6px] [&>a::after]:left-0 [&>a::after]:h-0.5 [&>a::after]:origin-center [&>a::after]:[transform:scaleX(0)] [&>a::after]:bg-white [&>a::after]:transition-transform [&>a::after]:duration-[180ms] [&>a::after]:content-[''] max-[700px]:[&>a::after]:hidden [&>a:focus-visible::after]:[transform:scaleX(1)] [&>a:hover::after]:[transform:scaleX(1)] max-[700px]:[&>a:nth-child(1)>span]:h-[5px] max-[700px]:[&>a:nth-child(1)>span]:w-[5px] max-[700px]:[&>a:nth-child(3)>span]:h-[5px] max-[700px]:[&>a:nth-child(3)>span]:w-[5px] max-[700px]:[&>a:nth-child(4)>span]:h-[7px] max-[700px]:[&>a:nth-child(4)>span]:w-[7px] max-[700px]:[&>a:nth-child(5)>span]:h-[5px] max-[700px]:[&>a:nth-child(5)>span]:w-[5px]"
		>
			<a
				class:active={page.url.pathname === '/'}
				class:menu-open={menuOpen}
				class="group relative inline-flex items-center gap-[3px] text-[15px] leading-none font-[530] whitespace-nowrap text-white no-underline transition-colors max-[700px]:min-h-[52px] max-[700px]:w-max max-[700px]:[transform:translateX(-24px)] max-[700px]:gap-2.5 max-[700px]:px-3 max-[700px]:text-[25px] max-[700px]:uppercase max-[700px]:opacity-0 max-[700px]:transition-[opacity,transform] max-[700px]:duration-[300ms] max-[700px]:ease-[cubic-bezier(0.22,1,0.36,1)] max-[700px]:hover:text-[#8ed8ff] max-[700px]:focus-visible:text-[#8ed8ff] max-[700px]:[&.active]:text-[#8ed8ff] max-[700px]:[&.active]:w-[min(280px,73vw)] max-[700px]:[&.active]:bg-[#29248c] max-[700px]:[&.active]:[clip-path:polygon(0_0,100%_0,100%_68%,90%_100%,0_100%)] max-[700px]:[&.menu-open]:[transform:translateX(0)] max-[700px]:[&.menu-open]:opacity-100"
				href="/"
				onclick={() => (menuOpen = false)}
				><span
					class="h-[5px] w-[5px] shrink-0 bg-current font-['Arial'] text-[12px] leading-none group-[.active]:bg-[#8ed8ff] min-[701px]:hidden"
					aria-hidden="true"
				></span>Home</a
			>
			<a
				class:active={page.url.pathname.startsWith('/gallery')}
				class:menu-open={menuOpen}
				class="group relative inline-flex items-center gap-[3px] text-[15px] leading-none font-[530] whitespace-nowrap text-white no-underline transition-colors max-[700px]:min-h-[52px] max-[700px]:w-max max-[700px]:[transform:translateX(-24px)] max-[700px]:gap-2.5 max-[700px]:px-3 max-[700px]:text-[25px] max-[700px]:uppercase max-[700px]:opacity-0 max-[700px]:transition-[opacity,transform] max-[700px]:duration-[300ms] max-[700px]:ease-[cubic-bezier(0.22,1,0.36,1)] max-[700px]:hover:text-[#8ed8ff] max-[700px]:focus-visible:text-[#8ed8ff] max-[700px]:[&.active]:text-[#8ed8ff] max-[700px]:[&.active]:w-[min(280px,73vw)] max-[700px]:[&.active]:bg-[#29248c] max-[700px]:[&.active]:[clip-path:polygon(0_0,100%_0,100%_68%,90%_100%,0_100%)] max-[700px]:[&.menu-open]:[transform:translateX(0)] max-[700px]:[&.menu-open]:opacity-100"
				href="/gallery"
				onclick={() => (menuOpen = false)}
				><span
					class="h-0 w-0 shrink-0 border-x-[3px] border-b-[5px] border-x-transparent border-b-current bg-transparent font-['Arial'] text-[12px] leading-none group-[.active]:border-b-[#8ed8ff] min-[701px]:hidden"
					aria-hidden="true"
				></span>Gallery</a
			>
			<a
				class:active={page.url.pathname.startsWith('/modules')}
				class="group relative inline-flex items-center gap-[3px] text-[15px] leading-none font-[530] whitespace-nowrap text-white no-underline transition-colors max-[700px]:min-h-[52px] max-[700px]:w-max max-[700px]:[transform:translateX(-24px)] max-[700px]:gap-2.5 max-[700px]:px-3 max-[700px]:text-[25px] max-[700px]:uppercase max-[700px]:opacity-0 max-[700px]:transition-[opacity,transform] max-[700px]:duration-[300ms] max-[700px]:ease-[cubic-bezier(0.22,1,0.36,1)] max-[700px]:hover:text-[#8ed8ff] max-[700px]:focus-visible:text-[#8ed8ff] max-[700px]:[&.active]:text-[#8ed8ff]"
				href="/modules"
				onclick={() => (menuOpen = false)}
				><span
					class="h-[5px] w-[5px] shrink-0 rounded-full bg-current font-['Arial'] text-[12px] leading-none group-[.active]:bg-[#8ed8ff] min-[701px]:hidden"
					aria-hidden="true"
				></span>Modules</a
			>
			<a
				class:active={page.url.pathname.startsWith('/spark')}
				class="group relative inline-flex items-center gap-[3px] text-[15px] leading-none font-[530] whitespace-nowrap text-white no-underline transition-colors max-[700px]:min-h-[52px] max-[700px]:w-max max-[700px]:[transform:translateX(-24px)] max-[700px]:gap-2.5 max-[700px]:px-3 max-[700px]:text-[25px] max-[700px]:uppercase max-[700px]:opacity-0 max-[700px]:transition-[opacity,transform] max-[700px]:duration-[300ms] max-[700px]:ease-[cubic-bezier(0.22,1,0.36,1)] max-[700px]:hover:text-[#8ed8ff] max-[700px]:focus-visible:text-[#8ed8ff] max-[700px]:[&.active]:text-[#8ed8ff]"
				href="/spark"
				onclick={() => (menuOpen = false)}
				><span
					class="h-2 w-2 shrink-0 bg-current font-['Arial'] text-[12px] leading-none [clip-path:polygon(50%_0,62%_38%,100%_50%,62%_62%,50%_100%,38%_62%,0_50%,38%_38%)] group-[.active]:bg-[#8ed8ff] min-[701px]:hidden"
					aria-hidden="true"
				></span>Spark</a
			>
			<a
				class:active={page.url.pathname.startsWith('/team')}
				class="group relative inline-flex items-center gap-[3px] text-[15px] leading-none font-[530] whitespace-nowrap text-white no-underline transition-colors max-[700px]:min-h-[52px] max-[700px]:w-max max-[700px]:[transform:translateX(-24px)] max-[700px]:gap-2.5 max-[700px]:px-3 max-[700px]:text-[25px] max-[700px]:uppercase max-[700px]:opacity-0 max-[700px]:transition-[opacity,transform] max-[700px]:duration-[300ms] max-[700px]:ease-[cubic-bezier(0.22,1,0.36,1)] max-[700px]:hover:text-[#8ed8ff] max-[700px]:focus-visible:text-[#8ed8ff] max-[700px]:[&.active]:text-[#8ed8ff]"
				href="/team"
				onclick={() => (menuOpen = false)}
				><span
					class="h-[7px] w-[7px] shrink-0 bg-current font-['Arial'] text-[12px] leading-none [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] group-[.active]:bg-[#8ed8ff] min-[701px]:hidden"
					aria-hidden="true"
				></span>Team<i class="not-italic max-[700px]:hidden"></i></a
			>
		</div>

		<!-- Mobile only: Register button (unchanged) -->
		<div
			class="hidden max-[700px]:mt-0 max-[700px]:mr-0 max-[700px]:mb-0 max-[700px]:ml-auto max-[700px]:flex max-[700px]:h-[46px] max-[700px]:basis-[clamp(88px,25.5vw,122px)] max-[700px]:self-center max-[700px]:overflow-hidden max-[700px]:rounded-none"
		>
			<button
				class="h-full w-full cursor-pointer border-0 bg-[rgba(110,110,110,0.72)] font-game-demo text-[13px] text-white uppercase transition-colors duration-200 [clip-path:polygon(0_0,100%_0,100%_100%,14%_100%,0_72%)] hover:bg-[#c4b5fd] hover:text-[#29248c] focus-visible:bg-[#c4b5fd] focus-visible:text-[#29248c] max-[700px]:bg-[#29248c] max-[700px]:text-[10px] max-[700px]:hover:bg-[#a78bfa] max-[700px]:focus-visible:bg-[#a78bfa]"
				type="button"
				onclick={() => goto('/auth/signup')}>Register</button
			>
		</div>

		<!-- Desktop only: plain "Login" text link on the right -->
		<a
			class="relative hidden font-game-demo text-[15
			px] leading-none whitespace-nowrap text-white no-underline min-[701px]:inline-flex after:absolute after:inset-x-0 after:-bottom-[6px] after:h-0.5 after:origin-center after:bg-white after:transition-transform after:duration-[180ms] after:content-[''] after:[transform:scaleX(0)] hover:after:[transform:scaleX(1)] focus-visible:after:[transform:scaleX(1)]"
			href="/auth/login">Login</a
		>
	</nav>
</header>