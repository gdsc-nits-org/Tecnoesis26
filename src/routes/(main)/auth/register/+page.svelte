<script lang="ts">
	import { resolve } from '$app/paths';

	function handleGoogleSignup() {
		// Backend / Google authentication can be connected later.
		console.log('Google signup clicked');
	}
</script>

<svelte:head>
	<title>Sign up | Tecnoesis</title>

	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0"
	/>
</svelte:head>

<div
	class="
		relative
		min-h-screen
		w-full
		overflow-hidden
		bg-[#21105c]
	"
>
<!-- BLURRED MOBILE BACKGROUND -->
<div
	class="
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
		md:blur-0
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
			left-0
			right-0
			top-0
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
						rounded-md
						bg-white/10
						px-3
						py-2
						font-sans
						text-base
						font-bold
						text-white
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

				<span class="text-white/60">
					Already have an account?
				</span>

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
			left-0
			right-0
			top-0
			z-30
			flex
			items-center
			justify-between
			px-5
			pt-7

			md:hidden
		"
	>
		<!-- BACK -->

		<button
			type="button"
			onclick={() => history.back()}
			class="
				flex
				items-center
				gap-1
				text-[16px]
				text-fuchsia-500
			"
		>
			<span class="text-[25px] leading-none">‹</span>


		<!-- LOGIN -->

		<div
			class="
				text-[11px]
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
			min-h-screen
			w-full
			flex-col
			items-center

			px-5
			pt-[170px]
			pb-[100px]

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
				relative
				flex
				w-full
				flex-col
				items-center

				/* MOBILE */
				min-h-0
				rounded-none
				border-0
				bg-transparent
				shadow-none
				backdrop-blur-none

				/* DESKTOP */
				md:min-h-[620px]
				md:max-w-[1130px]
				md:flex-row
				md:items-center
				md:overflow-hidden
				md:rounded-[32px]
				md:border
				md:border-white/25
				md:bg-white/10
				md:shadow-[0_8px_32px_rgba(0,0,0,0.12)]
				md:backdrop-blur-[16px]
				md:px-16
				md:py-16
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
					px-8

					md:flex
				"
			>
				<img
					src="/radio.png"
					alt="Retro cassette"
					class="
						w-full
						max-w-[560px]
						rotate-[-7deg]
						object-contain
						drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)]
					"
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

					md:w-1/2
					md:justify-center
					md:px-10

					gap-20
				"
			>
				<!-- ================================================= -->
				<!-- HEADING                                            -->
				<!-- ================================================= -->

				<h1
					class="
						game-paused
						text-center
						leading-none
						text-white

						text-[34px]

						md:text-[38px]
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
		h-[70px]
		w-[440px]
		items-center
		justify-center
		gap-5
		rounded-[20px]
		border
		border-white/30
		bg-white/[0.10]
		text-white
		shadow-[0_8px_25px_rgba(0,0,0,0.12)]
		backdrop-blur-[65px]
		transition
		duration-200
		hover:bg-white/[0.15]
		active:scale-[0.98]

		max-[500px]:h-[65px]
		max-[500px]:w-[calc(100vw-90px)]
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

				<!-- ================================================= -->
				<!-- MOBILE ACCOUNT TEXT                                -->
				<!-- ================================================= -->

				<p
					class="
						mt-6
						text-center
						text-[11px]
						text-white/60

						md:text-sm
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
							transition-opacity
							hover:opacity-70
						"
					>
						Log in
					</a>
				</p>
			</div>
		</div>
	</main>

	<!-- ====================================================== -->
	<!-- MOBILE BOTTOM SECTION                                  -->
	<!-- ====================================================== -->

	<div
		class="
			absolute
			bottom-[85px]
			left-0
			right-0
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
				mt-3
				h-[46px]
				w-[283px]
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
			bottom-3
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
	@font-face {
		font-family: 'Game Paused';
		src: url('/fonts/GamePausedDEMO-Regular.otf') format('opentype');
		font-weight: 400;
		font-style: normal;
		font-display: swap;
	}

	.game-paused {
		font-family: 'Game Paused', monospace;
	}

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