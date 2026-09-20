<script lang="ts">
	import { resolve } from '$app/paths';

	function handleGoogleSignup() {
		// Backend / Google authentication can be connected later.
		console.log('Google signup clicked');
	}
</script>

<svelte:head>
	<title>Sign up | Tecnoesis</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div
	class="
		relative
		min-h-[100svh]
		w-full
		overflow-hidden
		bg-[#21105c]
	"
>
	<!-- BLURRED MOBILE BACKGROUND -->
	<div
		class="
		md:blur-0
		pointer-events-none
		absolute
		inset-0
		z-0
		scale-105
		bg-[url('/login-bg.png')]
		bg-cover
		bg-center
		bg-no-repeat
		blur-[5px]
	"
	></div>
	<!-- ====================================================== -->
	<!-- BACKGROUND OVERLAY                                     -->
	<!-- ====================================================== -->

	<div
		class="
			pointer-events-none
			absolute
			inset-0
			z-0
			bg-[#21105c]/20
		"
	></div>

	<!-- ====================================================== -->
	<!-- DESKTOP NAVBAR                                         -->
	<!-- ====================================================== -->

	<header
		class="
			absolute
			top-0
			right-0
			left-0
			z-30
			hidden
			px-8
			py-7

			md:block
		"
	>
		<nav
			class="
				mx-auto
				flex
				w-full
				max-w-[1050px]
				items-center
				justify-between
			"
		>
			<!-- LEFT NAVIGATION -->

			<div class="flex items-center gap-9">
				<a
					href={resolve('/')}
					class="
						font-sans
						text-base
						font-bold
						text-white
						transition-opacity
						hover:opacity-70
					"
				>
					Home
				</a>

				<a
					href={resolve('/gallery')}
					class="
						font-sans
						text-base
						font-bold
						text-white
						transition-opacity
						hover:opacity-70
					"
				>
					Gallery
				</a>

				<a
					href={resolve('/modules')}
					class="
						font-sans
						text-base
						font-bold
						text-white
						transition-opacity
						hover:opacity-70
					"
				>
					Modules
				</a>

				<a
					href={resolve('/spark')}
					class="
						font-sans
						text-base
						font-bold
						text-white
						transition-opacity
						hover:opacity-70
					"
				>
					Spark
				</a>

				<a
					href={resolve('/team')}
					class="
						font-sans
						text-base
						font-bold
						text-white
						transition-opacity
						hover:opacity-70
					"
				>
					Teams
				</a>
			</div>

			<!-- LOGIN -->

			<div class="flex items-center gap-2 text-sm">
				<svg
					class="h-7 w-7 text-white"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<circle cx="12" cy="8" r="4"></circle>
					<path d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6"></path>
				</svg>

				<span class="text-white/60"> Already have an account? </span>

				<a
					href={resolve('/auth/login')}
					class="
						text-fuchsia-500
						underline
						underline-offset-2
						transition-opacity
						hover:opacity-70
					"
				>
					Log in
				</a>
			</div>
		</nav>
	</header>

	<!-- ====================================================== -->
	<!-- MOBILE TOP BAR                                         -->
	<!-- ====================================================== -->

	<div
	class="
		absolute
		top-0
		right-0
		left-0
		z-30
		flex
		items-center
		justify-between
		px-5
		pt-6
		md:hidden
	"
>
	<!-- BACK -->

	<button
		type="button"
		onclick={() => history.back()}
		class="
			flex
			h-8
			items-center
			gap-1
			text-[16px]
			leading-none
			text-fuchsia-500
		"
	>
		<svg
			class="h-5 w-5 shrink-0"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M15 18l-6-6 6-6" />
		</svg>

		<span class="leading-none">Back</span>
	</button>

	<!-- LOGIN -->

	<div
		class="
			flex
			h-8
			items-center
			text-[11px]
			leading-none
			text-white/60
		"
	>
		<span>Already have an account?</span>

		<a
			href={resolve('/auth/login')}
			class="
				ml-1
				text-fuchsia-500
				underline
				underline-offset-2
			"
		>
			Log in
		</a>
	</div>
</div>

	<!-- ====================================================== -->
	<!-- MAIN                                                   -->
	<!-- ====================================================== -->

	<main
		class="
			relative
			z-10
			flex
			min-h-[100svh]
			w-full
			flex-col
			items-center

			px-[clamp(1.25rem,8vw,2rem)]
			pt-[clamp(8.5rem,20vh,10.5rem)]
			pb-[clamp(8rem,18vh,10rem)]

			md:flex-row
			md:items-center
			md:justify-center
			md:px-8
			md:py-28
		"
	>
		<!-- ================================================== -->
		<!-- DESKTOP GLASS CARD                                 -->
		<!-- ================================================== -->

		<div
			class="
				/*
				MOBILE
				*/
				/*
				DESKTOP

				*/ relative flex
				min-h-0
				w-full
				flex-col
				items-center
				rounded-none
				border-0

				bg-transparent shadow-none backdrop-blur-none
				md:min-h-[600px]
				md:max-w-[1080px]
				md:flex-row
				md:items-center
				md:overflow-hidden
				md:rounded-[32px]
				md:border
				md:border-white/25
				md:bg-white/10
				md:px-16
				md:py-16
				md:shadow-[0_8px_32px_rgba(0,0,0,0.12)]
				md:backdrop-blur-[16px]
			"
		>
			<!-- ================================================= -->
			<!-- LEFT SIDE — RADIO                                 -->
			<!-- ================================================= -->

			<div
				class="
					hidden
					w-1/2
					items-center
					justify-center
					px-1
					md:flex
				"
			>
				<img
					src="/radio.png"
					alt="Retro cassette"
					class="
						w-full
						max-w-[600px]
						rotate-[-3deg]
						object-contain
                        [filter:drop-shadow(0_0_12px_rgba(255,220,255,0.55))_drop-shadow(0_18px_30px_rgba(80,30,180,0.55))]"
				/>
			</div>

			<!-- ================================================= -->
			<!-- RIGHT / MOBILE CONTENT                             -->
			<!-- ================================================= -->

			<div
				class="
					flex
					w-full
					flex-col
					items-center
					gap-2
					md:gap-6
					md:w-1/2
					md:justify-center

					md:px-10
				"
			>
				<!-- ================================================= -->
				<!-- HEADING                                            -->
				<!-- ================================================= -->

				<h1
					class="
						game-paused
						text-center
						text-[clamp(2rem,8vw,2.75rem)]
						leading-none
						text-white
						mb-[clamp(7rem,17vh,9.5rem)]
						md:mb-0
						md:text-[30px]
					"
				>
					Sign up
				</h1>

				<!-- ================================================= -->
				<!-- GOOGLE BUTTON                                      -->
				<!-- ================================================= -->

				<button
					type="button"
					onclick={handleGoogleSignup}
					class="
		flex
	h-[60px]
	w-[300px]
	items-center
	justify-center
	gap-5
	rounded-[16px]
	border
	border-white/20
	bg-gradient-to-r
	from-[#7770d8]/55
	to-[#4c3c9e]/45
	text-white
	shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_25px_rgba(20,10,80,0.20)]
	backdrop-blur-[25px]
	transition
	duration-200
	hover:from-[#827be0]/65
	hover:to-[#5848aa]/55
	active:scale-[0.98]

					max-[500px]:h-[52px]
					max-[500px]:w-[calc(100vw-64px)]
	max-[500px]:gap-4
	"
				>
					<!-- GOOGLE ICON -->
					<svg
						class="h-[32px] w-[32px] shrink-0 max-[500px]:h-[28px] max-[500px]:w-[28px]"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							fill="#4285F4"
							d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
						/>
						<path
							fill="#34A853"
							d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.5z"
						/>
						<path
							fill="#FBBC05"
							d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.08.31-1.59V7.88H3.3A9.5 9.5 0 0 0 2.25 12c0 1.49.36 2.9 1.05 4.12l3.24-2.53z"
						/>
						<path
							fill="#EA4335"
							d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.47 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38z"
						/>
					</svg>

					<span
						class="
			game-paused
			text-[24px]
			leading-none
			text-white
			max-[500px]:text-[19px]
		"
					>
						Sign up with Google
					</span>
				</button>
			</div>
		</div>
	</main>

	<!-- ====================================================== -->
	<!-- MOBILE BOTTOM SECTION                                  -->
	<!-- ====================================================== -->

	<div
		class="
			absolute
			right-0
			bottom-[64px]
			left-0
			z-30
			flex
			flex-col
			items-center

			md:hidden
		"
	>
		<!-- ACCOUNT TEXT -->

		<p
			class="
				text-center
				text-[11px]
				text-white/60
			"
		>
			Already have an account?

			<a
				href={resolve('/auth/login')}
				class="
					ml-2
					text-fuchsia-500
					underline
					underline-offset-2
				"
			>
				Log in
			</a>
		</p>

		<!-- GO BACK -->

		<button
			type="button"
			onclick={() => history.back()}
			class="
				mt-2
				h-[45px]
				w-[calc(100vw-64px)]
				max-w-[283px]
				rounded-full
				bg-fuchsia-600
				text-[18px]
				font-medium
				text-white
				transition
				hover:bg-fuchsia-500
				active:scale-[0.98]
			"
		>
			Go Back
		</button>
	</div>

	<!-- ====================================================== -->
	<!-- MOBILE HOME INDICATOR                                  -->
	<!-- ====================================================== -->

	<div
		class="
			absolute
			bottom-1
			left-1/2
			z-30
			h-1
			w-[116px]
			-translate-x-1/2
			rounded-full
			bg-white

			md:hidden
		"
	></div>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		width: 100%;
		min-height: 100%;
	}

	:global(body) {
		background: #21105c;
		overflow-x: hidden;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>