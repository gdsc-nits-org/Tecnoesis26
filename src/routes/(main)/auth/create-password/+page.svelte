<script lang="ts">
	import { resolve } from '$app/paths';

	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!password || !confirmPassword) {
			return;
		}

		if (password !== confirmPassword) {
			return;
		}

		console.log({
			password,
			confirmPassword
		});
	}
</script>

<svelte:head>
	<title>Create Password | Tecnoesis</title>
	<meta name="description" content="Create your Tecnoesis account password" />
</svelte:head>

<div class="relative min-h-screen w-full overflow-hidden bg-[#21105c]">
	<!-- ===================================================== -->
	<!-- BLURRED BACKGROUND (same as register page)             -->
	<!-- ===================================================== -->

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

	<!-- ===================================================== -->
	<!-- BACKGROUND OVERLAY                                     -->
	<!-- ===================================================== -->

	<div
		class="
			pointer-events-none
			absolute
			inset-0
			z-0
			bg-[#21105c]/20
		"
	></div>

	<!-- ===================================================== -->
	<!-- DESKTOP NAVBAR (same as register page)                 -->
	<!-- ===================================================== -->

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

	<!-- ===================================================== -->
	<!-- MOBILE TOP BAR (unchanged)                             -->
	<!-- ===================================================== -->

	<div
		class="
			absolute
		left-0
		right-0
		top-0
		z-40
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
		h-6
		items-center
		gap-1
		text-[14px]
		leading-none
		text-fuchsia-500
		md:hidden
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

		<!-- MOBILE LOGIN -->

		<a
			href={resolve('/auth/login')}
			class="
				text-[11px]
				text-white/65
			"
		>
			Already have an account?
			<span
				class="
					text-fuchsia-500
					underline
					underline-offset-2
				"
			>
				Log in
			</span>
		</a>
	</div>

	<!-- ===================================================== -->
	<!-- MAIN                                                    -->
	<!-- ===================================================== -->

	<main
		class="
			relative z-10
			flex min-h-screen w-full
			items-center justify-center
			px-5

			md:px-8
			md:py-28
		"
	>
		<!-- ================================================= -->
		<!-- MAIN CARD                                           -->
		<!--                                                     -->
		<!-- MOBILE: completely transparent                     -->
		<!-- DESKTOP: glass card (same size as register page)   -->
		<!-- ================================================= -->

		<div
			class="
				relative flex
				min-h-screen
				w-full
				flex-col

				rounded-none
				border-0
				bg-transparent
				shadow-none
				backdrop-blur-0

				px-5
				pb-12
				pt-[215px]

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
			<!-- LEFT SIDE — CASSETTE (DESKTOP ONLY)               -->
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
			<!-- RIGHT / FORM                                       -->
			<!-- ================================================= -->

			<div
				class="
					flex
					w-full
					flex-1
					flex-col

					md:w-1/2
					md:flex-none
					md:justify-center
					md:px-10
				"
			>
				<!-- ================================================= -->
				<!-- TITLE                                               -->
				<!-- ================================================= -->

				<h1
					class="
						game-paused
						text-center
						text-[28px]
						leading-none
						text-white

						md:text-[30px]
					"
				>
					Create Password
				</h1>

				<!-- ================================================= -->
				<!-- FORM                                                -->
				<!-- ================================================= -->

				<form
					onsubmit={handleSubmit}
					class="
						mt-[80px]
						flex
						flex-1
						flex-col

						md:mt-16
						md:flex-none
					"
				>
					<!-- ============================================= -->
					<!-- PASSWORD                                        -->
					<!-- ============================================= -->

					<div
						class="
							flex
							items-center
							gap-4

							md:gap-5
						"
					>
						<!-- LOCK ICON -->

						<svg
							class="
								h-8 w-8
								shrink-0
								text-white/75
							"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<rect x="4" y="10" width="16" height="11" rx="2" />

							<path d="M8 10V7a4 4 0 0 1 8 0v3" />
						</svg>

						<!-- INPUT -->

						<div
							class="
								relative
								flex
								flex-1
								items-center
								border-b
								border-white/45
								pb-2
							"
						>
							<input
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
								placeholder="Password"
								autocomplete="new-password"
								class="
									w-full
									border-0
									bg-transparent
									p-0
									pr-10
									text-[20px]
									text-white
									outline-none
									placeholder:text-white/65
									focus:ring-0

									md:text-[24px]
								"
							/>

							<!-- EYE BUTTON -->

							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="
									absolute
									right-0
									top-0
									text-white/60
									transition-opacity
									hover:text-white
								"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{#if showPassword}
									<svg
										class="h-6 w-6"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

										<circle cx="12" cy="12" r="2.5" />
									</svg>
								{:else}
									<svg
										class="h-6 w-6"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path d="M3 3l18 18" />

										<path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

										<path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.1" />

										<path d="M6.2 6.2C3.6 8.2 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8" />
									</svg>
								{/if}
							</button>
						</div>
					</div>

					<!-- ============================================= -->
					<!-- CONFIRM PASSWORD                                -->
					<!-- ============================================= -->

					<div
						class="
							mt-10
							flex
							items-center
							gap-4

							md:mt-12
							md:gap-5
						"
					>
						<!-- LOCK ICON -->

						<svg
							class="
								h-8 w-8
								shrink-0
								text-white/75
							"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<rect x="4" y="10" width="16" height="11" rx="2" />

							<path d="M8 10V7a4 4 0 0 1 8 0v3" />
						</svg>

						<!-- INPUT -->

						<div
							class="
								relative
								flex
								flex-1
								items-center
								border-b
								border-white/45
								pb-2
							"
						>
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={confirmPassword}
								placeholder="Confirm Password"
								autocomplete="new-password"
								class="
									w-full
									border-0
									bg-transparent
									p-0
									pr-10
									text-[20px]
									text-white
									outline-none
									placeholder:text-white/65
									focus:ring-0

									md:text-[24px]
								"
							/>

							<!-- EYE BUTTON -->

							<button
								type="button"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
								class="
									absolute
									right-0
									top-0
									text-white/60
									transition-opacity
									hover:text-white
								"
								aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
							>
								{#if showConfirmPassword}
									<svg
										class="h-6 w-6"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

										<circle cx="12" cy="12" r="2.5" />
									</svg>
								{:else}
									<svg
										class="h-6 w-6"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path d="M3 3l18 18" />

										<path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

										<path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.1" />

										<path d="M6.2 6.2C3.6 8.2 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8" />
									</svg>
								{/if}
							</button>
						</div>
					</div>

					<!-- ============================================= -->
					<!-- CONTINUE BUTTON                                 -->
					<!-- ============================================= -->

					<button
						type="submit"
						class="
							mt-auto
							w-full
							rounded-full
							bg-fuchsia-600
							py-3
							text-[18px]
							font-medium
							text-white
							transition
							hover:bg-red-500
							active:scale-[0.99]

							md:mt-16
							md:rounded-[10px]
							md:py-3
							md:text-[24px]
							md:shadow-[0_4px_18px_rgba(168,85,247,0.25)]
						"
					>
						Continue
					</button>
				</form>

				<!-- ================================================= -->
				<!-- DESKTOP LOGIN                                      -->
				<!-- ================================================= -->

				<p
					class="
						mt-5
						hidden
						text-center
						text-[13px]
						text-white/60

						md:block
					"
				>
					Already have an account?

					<a
						href={resolve('/auth/login')}
						class="
							ml-2
							text-fuchsia-400
							underline
							underline-offset-2
							transition-opacity
							hover:opacity-80
						"
					>
						Log in
					</a>
				</p>
			</div>
		</div>
	</main>

	<!-- ===================================================== -->
	<!-- MOBILE HOME INDICATOR                                  -->
	<!-- ===================================================== -->

	<div
		class="
			absolute
			bottom-3
			left-1/2
			z-40
			h-1
			w-[116px]
			-translate-x-1/2
			rounded-full
			bg-white
			md:hidden
		"
	></div>
</div>

