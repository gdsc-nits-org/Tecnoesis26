<script lang="ts">
	import { resolve } from '$app/paths';

	let username = $state('');
	let password = $state('');
	let showPassword = $state(false);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		console.log({
			username,
			password
		});
	}
</script>

<svelte:head>
	<title>Log in | Tecnoesis</title>

	<!-- Sulphur Point -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Sulphur+Point:wght@300;400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="relative min-h-screen w-full overflow-hidden bg-[#21105c] bg-[url('/login-bg.png')] bg-cover bg-center bg-no-repeat [font-family:'Sulphur_Point',sans-serif]"
>
	<!-- Background overlay -->
	<div class="absolute inset-0 bg-[#21105c]/10"></div>

	<!-- ========================================================= -->
	<!-- DESKTOP NAVBAR                                            -->
	<!-- ========================================================= -->

	<header class="absolute left-0 right-0 top-0 z-30 hidden px-8 py-7 md:block">
		<nav class="mx-auto flex w-full max-w-[1050px] items-center justify-between">
			<!-- Left navigation -->
			<div class="flex items-center gap-9">
				<a
					href={resolve('/')}
					class="text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Home
				</a>

				<a
					href={resolve('/gallery')}
					class="text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Gallery
				</a>

				<a
					href={resolve('/modules')}
					class="rounded-md bg-white/10 px-3 py-2 text-base font-bold text-white"
				>
					Modules
				</a>

				<a
					href={resolve('/spark')}
					class="text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Spark
				</a>

				<a
					href={resolve('/team')}
					class="text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Teams
				</a>
			</div>

			<!-- Sign up -->
			<div class="flex items-center gap-2 text-sm">
				<span class="text-white/60">Don't have an account?</span>

				<a
					href={resolve('/auth/signup')}
					class="text-pink-500 transition-opacity hover:opacity-70"
				>
					Sign up
				</a>
			</div>
		</nav>
	</header>

	<!-- ========================================================= -->
	<!-- MOBILE BACK BUTTON                                        -->
	<!-- ========================================================= -->

	<button
		type="button"
		onclick={() => history.back()}
		class="absolute left-5 top-6 z-30 flex items-center gap-1 text-base text-fuchsia-500 md:hidden"
	>
		<span class="text-2xl leading-none">‹</span>
		<span>Back</span>
	</button>

	<!-- ========================================================= -->
	<!-- LOGIN AREA                                                -->
	<!-- ========================================================= -->

	<main
		class="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-10 md:px-8 md:py-16"
	>
		<!-- ===================================================== -->
		<!-- GLASS CARD                                            -->
		<!-- ===================================================== -->

		<div
			class="
				relative
				flex
				w-full
				max-w-[548px]
				flex-col
				overflow-hidden
				rounded-[32px]
				border
				border-white/20
				bg-white/10
				px-7
				pb-12
				pt-16
				shadow-[0_8px_32px_rgba(0,0,0,0.10)]
				backdrop-blur-[16px]

				md:min-h-[745px]
				md:px-[72px]
				md:pb-[70px]
				md:pt-[68px]

				max-md:border-transparent
				max-md:bg-transparent
				max-md:shadow-none
				max-md:backdrop-blur-0
				max-md:justify-center
			"
		>
			<!-- ================================================= -->
			<!-- TITLE                                             -->
			<!-- ================================================= -->

			<h1
				class="
					text-center
					text-[38px]
					font-bold
					leading-none
					text-white
					md:text-[42px]
				"
			>
				Log In
			</h1>

			<!-- ================================================= -->
			<!-- FORM                                              -->
			<!-- ================================================= -->

			<form
				onsubmit={handleSubmit}
				class="
					mt-20
					flex
					flex-col
					md:mt-[82px]
				"
			>
				<!-- Username -->
				<div class="relative">
					<div class="flex items-center gap-4">
						<!-- User icon -->
						<svg
							class="h-7 w-7 shrink-0 text-white/65"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<circle cx="12" cy="7" r="4"></circle>
							<path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7H4Z"></path>
						</svg>

						<div class="flex-1 border-b border-white/50 pb-2">
							<input
								type="text"
								bind:value={username}
								placeholder="Username"
								autocomplete="username"
								class="
									w-full
									border-0
									bg-transparent
									p-0
									text-[22px]
									text-white
									outline-none
									placeholder:text-white/65
									focus:ring-0
									md:text-[21px]
								"
							/>
						</div>
					</div>
				</div>

				<!-- Password -->
				<div class="relative mt-10">
					<div class="flex items-center gap-4">
						<!-- Lock icon -->
						<svg
							class="h-8 w-8 shrink-0 text-white/65"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<rect x="4" y="10" width="16" height="11" rx="2"></rect>
							<path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
						</svg>

						<div class="relative flex-1 border-b border-white/50 pb-2">
							<input
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
								placeholder="Enter password"
								autocomplete="current-password"
								class="
									w-full
									border-0
									bg-transparent
									p-0
									pr-8
									text-[22px]
									text-white
									outline-none
									placeholder:text-white/65
									focus:ring-0
									md:text-[21px]
								"
							/>

							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute right-0 top-0 text-white/60 transition-opacity hover:opacity-100"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{#if showPassword}
									<!-- Eye -->
									<svg
										class="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
										<circle cx="12" cy="12" r="2.5" />
									</svg>
								{:else}
									<!-- Eye off -->
									<svg
										class="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M3 3l18 18" />
										<path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
										<path
											d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.1"
										/>
										<path
											d="M6.2 6.2C3.6 8.2 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8"
										/>
									</svg>
								{/if}
							</button>
						</div>
					</div>

					<!-- Forgot password -->
					<div class="mt-2 text-right text-[11px] text-white/60">
						Forgot password?
						<span class="text-fuchsia-500">click here</span>
					</div>
				</div>

				<!-- ================================================= -->
				<!-- LOGIN BUTTON                                      -->
				<!-- ================================================= -->

				<button
					type="submit"
					class="
						mt-28
						w-full
						rounded-full
						bg-fuchsia-600
						py-3
						text-[20px]
						font-medium
						text-white
						transition
						hover:bg-fuchsia-500
						active:scale-[0.99]

						md:mt-[108px]
						md:rounded-md
					"
				>
					Log In
				</button>
			</form>

			<!-- ================================================= -->
			<!-- SIGN UP                                            -->
			<!-- ================================================= -->

			<p class="mt-3 text-center text-sm text-white/60">
				Don't have an account?
				<a
					href={resolve('/auth/signup')}
					class="text-fuchsia-500 underline-offset-2 hover:underline"
				>
					Sign Up
				</a>
			</p>

			<!-- ================================================= -->
			<!-- OR DIVIDER                                         -->
			<!-- ================================================= -->

			<div class="mt-5 flex items-center justify-center gap-5">
				<div class="h-px w-24 bg-white/35"></div>

				<span class="text-lg text-white/60">or</span>

				<div class="h-px w-24 bg-white/35"></div>
			</div>

			<!-- ================================================= -->
			<!-- SOCIAL LOGIN                                       -->
			<!-- ================================================= -->

			<div class="mt-6 flex items-center justify-center gap-5">
				<!-- Google -->
				<button
					type="button"
					aria-label="Continue with Google"
					class="flex h-10 w-10 items-center justify-center rounded-full bg-white"
				>
					<span class="text-[21px] font-bold text-[#4285F4]">G</span>
				</button>

				<!-- Facebook -->
				<button
					type="button"
					aria-label="Continue with Facebook"
					class="flex h-10 w-10 items-center justify-center rounded-full bg-white"
				>
					<span class="text-[22px] font-bold text-[#1877F2]">f</span>
				</button>

				<!-- X -->
				<button
					type="button"
					aria-label="Continue with X"
					class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
				>
					<span class="text-[21px] font-medium">𝕏</span>
				</button>
			</div>

			<!-- ================================================= -->
			<!-- GUEST                                             -->
			<!-- ================================================= -->

			<button
				type="button"
				class="
					mx-auto
					mt-4
					text-sm
					text-white/60
					underline
					underline-offset-2
					transition-opacity
					hover:opacity-80
				"
			>
				Continue as Guest
			</button>
		</div>
	</main>

	<!-- Mobile home indicator -->
	<div
		class="absolute bottom-5 left-1/2 z-30 h-1 w-36 -translate-x-1/2 rounded-full bg-white md:hidden"
	></div>
</div>