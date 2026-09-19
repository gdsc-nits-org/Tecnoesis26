<script lang="ts">
	import { resolve } from '$app/paths';

	let email = $state('');
	let useUsername = $state(false);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		console.log({
			type: useUsername ? 'username' : 'email',
			value: email
		});
	}
</script>

<svelte:head>
	<title>Forgot Password | Tecnoesis</title>
	<meta
		name="description"
		content="Recover your Tecnoesis account"
	/>
</svelte:head>

<div
	class="
		relative min-h-screen w-full overflow-hidden
		bg-[#21105c]
		bg-[url('/login-bg.png')]
		bg-cover
		bg-center
		bg-no-repeat
	"
>
	<!-- ================================================= -->
	<!-- MOBILE BACKGROUND BLUR                            -->
	<!-- ================================================= -->

	<div
	class="
		pointer-events-none
		absolute inset-0 z-0
		bg-[#21105c]/20
		backdrop-blur-[14px]
		md:hidden
	"
></div>

	<!-- Desktop overlay -->
	<div
		class="
			pointer-events-none
			absolute inset-0 z-0
			bg-[#21105c]/10
			hidden md:block
		"
	></div>

	<!-- ================================================= -->
	<!-- DESKTOP NAVBAR                                    -->
	<!-- ================================================= -->

	<header
		class="
			absolute left-0 right-0 top-0 z-30
			hidden
			px-8 py-7
			md:block
		"
	>
		<nav
			class="
				mx-auto flex w-full max-w-[1000px]
				items-center justify-between
			"
		>
			<div class="flex items-center gap-10">
				<a
					href={resolve('/')}
					class="
						font-mono text-[16px] font-bold text-white
						transition-opacity hover:opacity-70
					"
				>
					Home
				</a>

				<a
					href={resolve('/gallery')}
					class="
						font-mono text-[16px] font-bold text-white
						transition-opacity hover:opacity-70
					"
				>
					Gallery
				</a>

				<a
					href={resolve('/modules')}
					class="
						font-mono text-[16px] font-bold text-white
						transition-opacity hover:opacity-70
					"
				>
					Modules
				</a>

				<a
					href={resolve('/spark')}
					class="
						font-mono text-[16px] font-bold text-white
						transition-opacity hover:opacity-70
					"
				>
					Spark
				</a>

				<a
					href={resolve('/team')}
					class="
						font-mono text-[16px] font-bold text-white
						transition-opacity hover:opacity-70
					"
				>
					Teams
				</a>
			</div>

			<div class="flex items-center gap-4">
				<span class="font-mono text-[13px] text-white/65">
					Don't have an account?
				</span>

				<a
					href={resolve('/auth/signup')}
					class="
						font-mono text-[13px] text-fuchsia-500
						transition-opacity hover:opacity-75
					"
				>
					Sign up
				</a>
			</div>
		</nav>
	</header>

	<!-- ================================================= -->
	<!-- MOBILE BACK                                       -->
	<!-- ================================================= -->

	<button
		type="button"
		onclick={() => history.back()}
		class="
			absolute left-5 top-8 z-40
			flex items-center gap-1
			text-[15px] text-fuchsia-500
			md:hidden
		"
	>
		<span class="text-[25px] leading-none">‹</span>
		<span>Back</span>
	</button>

	<!-- ================================================= -->
	<!-- MAIN                                              -->
	<!-- ================================================= -->

	<main
		class="
			relative z-10
			flex min-h-screen w-full
			items-center justify-center

			px-6

			md:px-8
		"
	>
		<!-- ================================================= -->
		<!-- CARD                                                -->
		<!-- MOBILE: COMPLETELY TRANSPARENT                     -->
		<!-- DESKTOP: GLASS CARD                                -->
		<!-- ================================================= -->

		<div
			class="
				flex min-h-screen w-full
				flex-col

				/* MOBILE */
				rounded-none
				border-0
				bg-transparent
				shadow-none
				backdrop-blur-none

				px-6
				pb-20
				pt-[190px]

				/* DESKTOP */
				md:min-h-0
				md:max-w-[540px]
				md:rounded-[32px]
				md:border
				md:border-white/25
				md:bg-white/[0.12]
				md:px-[72px]
				md:pb-20
				md:pt-28
				md:shadow-[0_8px_32px_rgba(0,0,0,0.10)]
				md:backdrop-blur-[45px]
			"
		>
			<!-- ================================================= -->
			<!-- TITLE                                               -->
			<!-- ================================================= -->

			<h1
				class="
					game-paused
					text-center
					text-[25px]
					leading-none
					text-white

					md:text-[40px]
				"
			>
				Forgot Password
			</h1>

			<!-- ================================================= -->
			<!-- FORM                                                -->
			<!-- ================================================= -->

			<form
				onsubmit={handleSubmit}
				class="
					mt-[80px]
					flex flex-col

					md:mt-20
				"
			>
				<!-- EMAIL -->
				<div class="relative">
					<div
						class="
							flex items-center
							gap-3

							md:gap-4
						"
					>
						<!-- EMAIL ICON -->
						<svg
							class="
								h-7 w-7 shrink-0
								text-white/85

								md:h-9 md:w-9
							"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							aria-hidden="true"
						>
							<rect
								x="3"
								y="5"
								width="18"
								height="14"
								rx="3"
							/>
							<path d="m4 7 8 6 8-6" />
						</svg>

						<!-- INPUT -->
						<div
							class="
								flex flex-1
								border-b border-white/50
								pb-1

								md:pb-2
							"
						>
							<input
								type={useUsername ? 'text' : 'email'}
								bind:value={email}
								placeholder={useUsername ? 'Username' : 'Email'}
								autocomplete={
									useUsername ? 'username' : 'email'
								}
								class="
									w-full
									border-0
									bg-transparent
									p-0
									text-[16px]
									text-white
									outline-none
									placeholder:text-white/70
									focus:ring-0

									md:text-[21px]
								"
							/>
						</div>
					</div>

					<!-- USE USERNAME -->
					<button
						type="button"
						onclick={() => (useUsername = !useUsername)}
						class="
							ml-[40px]
							mt-1
							text-left
							text-[10px]
							text-fuchsia-500
							underline
							underline-offset-2
							transition-opacity
							hover:opacity-80

							md:ml-[52px]
							md:text-[13px]
						"
					>
						{useUsername ? 'Use email' : 'Use username'}
					</button>
				</div>

				<!-- ================================================= -->
				<!-- GET OTP                                             -->
				<!-- ================================================= -->

				<button
					type="submit"
					class="
						mt-[295px]
						w-full
						rounded-full
						bg-fuchsia-600
						py-2
						text-[15px]
						font-medium
						text-white
						transition
						hover:bg-fuchsia-500
						active:scale-[0.99]

						md:mt-[275px]
						md:rounded-[10px]
						md:py-3
						md:text-[24px]
						md:shadow-[0_4px_18px_rgba(168,85,247,0.25)]
					"
				>
					<span class="md:hidden">
						Get OTP
					</span>

					<span class="hidden md:inline">
						Log in
					</span>
				</button>
			</form>

			<!-- ================================================= -->
			<!-- MOBILE SIGN UP                                      -->
			<!-- ================================================= -->

			<p
				class="
					mt-2
					text-center
					text-[10px]
					text-white/60

					md:hidden
				"
			>
				Don't have an account?
				<a
					href={resolve('/auth/signup')}
					class="
						text-fuchsia-500
						underline
						underline-offset-2
					"
				>
					Sign Up
				</a>
			</p>

			<!-- ================================================= -->
			<!-- DESKTOP RESET PASSWORD                              -->
			<!-- ================================================= -->

			<div
				class="
					mt-5
					hidden
					text-center
					text-[13px]
					md:block
				"
			>
				<span class="text-white/60">
					Forgot Password ?
				</span>

				<button
					type="button"
					class="
						ml-1
						text-fuchsia-500
						underline
						underline-offset-2
						transition-opacity
						hover:opacity-80
					"
					onclick={() => {
						console.log('Reset Password clicked');
					}}
				>
					Reset Password
				</button>
			</div>
		</div>
	</main>

	<!-- ================================================= -->
	<!-- MOBILE HOME INDICATOR                              -->
	<!-- ================================================= -->

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
</style>