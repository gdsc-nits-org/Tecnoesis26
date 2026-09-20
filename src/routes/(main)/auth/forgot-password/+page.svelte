<script lang="ts">
	import { resolve } from '$app/paths';

	type Step = 'email' | 'otp' | 'reset';

	const titles: Record<Step, string> = {
		email: 'Forgot Password',
		otp: 'Verify',
		reset: 'Update Password'
	};

	// which section of the card is showing
	let step = $state<Step>('email');

	// step 1 — email / username
	let email = $state('');
	let useUsername = $state(false);

	// step 2 — OTP (4 digits)
	let otp = $state(['', '', '', '']);
	let otpInputs: HTMLInputElement[] = [];

	// step 3 — new password
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	// jump into the first OTP box when the OTP section opens
	$effect(() => {
		if (step === 'otp') {
			otpInputs[0]?.focus();
		}
	});

	// Back goes to the previous section first, then to the previous page
	function goBack() {
		if (step === 'reset') {
			step = 'otp';
		} else if (step === 'otp') {
			step = 'email';
		} else {
			history.back();
		}
	}

	function handleOtpInput(event: Event, index: number) {
		const input = event.currentTarget as HTMLInputElement;
		const digit = input.value.replace(/\D/g, '').slice(-1);

		otp[index] = digit;
		input.value = digit;

		if (digit && index < otp.length - 1) {
			otpInputs[index + 1]?.focus();
		}
	}

	function handleOtpKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Backspace' && !otp[index] && index > 0) {
			otpInputs[index - 1]?.focus();
		}
	}

	function handleOtpPaste(event: ClipboardEvent) {
		event.preventDefault();

		const digits = (event.clipboardData?.getData('text') ?? '')
			.replace(/\D/g, '')
			.slice(0, otp.length);

		digits.split('').forEach((digit, i) => {
			otp[i] = digit;
		});

		otpInputs[Math.min(digits.length, otp.length - 1)]?.focus();
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (step === 'email') {
			if (!email) return;

			console.log({
				type: useUsername ? 'username' : 'email',
				value: email
			});

			step = 'otp';
			return;
		}

		if (step === 'otp') {
			if (otp.some((digit) => !digit)) return;

			console.log({ otp: otp.join('') });

			step = 'reset';
			return;
		}

		if (!password || !confirmPassword) return;
		if (password !== confirmPassword) return;

		console.log({ password, confirmPassword });
	}
</script>

<svelte:head>
	<title>Forgot Password | Tecnoesis</title>
	<meta name="description" content="Recover your Tecnoesis account" />
</svelte:head>

<!-- ================================================= -->
<!-- REUSABLE ICONS                                     -->
<!-- ================================================= -->

{#snippet lockIcon()}
	<svg
		class="h-8 w-8 shrink-0 text-[#e4dbf7]"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M8 10V7a4 4 0 0 1 8 0v3"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<rect x="4" y="10" width="16" height="11" rx="3" fill="currentColor" />
		<rect x="9" y="14.5" width="6" height="2" rx="1" fill="#3b2a80" />
	</svg>
{/snippet}

{#snippet eyeIcon(visible: boolean)}
	<svg
		class="h-6 w-6"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		{#if visible}
			<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
			<circle cx="12" cy="12" r="2.5" />
		{:else}
			<path d="M3 3l18 18" />
			<path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
			<path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.1" />
			<path d="M6.2 6.2C3.6 8.2 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8" />
		{/if}
	</svg>
{/snippet}

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
	<!-- DESKTOP NAVBAR (same as the other auth pages)     -->
	<!-- ================================================= -->

	<header
		class="
			absolute top-0 right-0 left-0 z-30
			hidden
			px-8 py-7
			md:block
		"
	>
		<nav
			class="
				mx-auto flex w-full max-w-[1050px]
				items-center justify-between
			"
		>
			<div class="flex items-center gap-9">
				<a
					href={resolve('/')}
					class="font-sans text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Home
				</a>

				<a
					href={resolve('/gallery')}
					class="font-sans text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Gallery
				</a>

				<a
					href={resolve('/modules')}
					class="font-sans text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Modules
				</a>

				<a
					href={resolve('/spark')}
					class="font-sans text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Spark
				</a>

				<a
					href={resolve('/team')}
					class="font-sans text-base font-bold text-white transition-opacity hover:opacity-70"
				>
					Teams
				</a>
			</div>

			<div class="flex items-center gap-2 text-sm">
				<span class="text-white/60"> Don't have an account? </span>

				<a
					href={resolve('/auth/signup')}
					class="
						text-fuchsia-500
						underline
						underline-offset-2
						transition-opacity
						hover:opacity-70
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
	onclick={goBack}
	class="
		absolute
		left-5
		top-7
		z-40
		flex
		h-6
		items-center
		gap-1
		p-0
		text-[15px]
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
			md:py-28
		"
	>
		<!-- ============================================= -->
		<!-- CARD                                            -->
		<!-- MOBILE: completely transparent                 -->
		<!-- DESKTOP: fixed-size glass card (440 x 600)     -->
		<!-- The same card is reused for all three steps    -->
		<!-- ============================================= -->

		<div
			class="
				flex min-h-screen w-full
				flex-col

				rounded-none
				border-0
				bg-transparent
				shadow-none
				backdrop-blur-none

				px-6
				pb-20
				pt-[190px]

				md:h-[600px]
				md:min-h-0
				md:max-w-[440px]
				md:rounded-[32px]
				md:border
				md:border-white/25
				md:bg-white/[0.12]
				md:px-14
				md:pb-[72px]
				md:pt-24
				md:shadow-[0_8px_32px_rgba(0,0,0,0.10)]
				md:backdrop-blur-[45px]
			"
		>
			<!-- ========================================= -->
			<!-- TITLE (changes with the step)              -->
			<!-- ========================================= -->

			<h1
				class="
					game-paused
					text-center
					text-[25px]
					leading-none
					text-white

					md:text-[30px]
				"
			>
				{titles[step]}
			</h1>

			<!-- ========================================= -->
			<!-- FORM                                        -->
			<!-- ========================================= -->

			<form onsubmit={handleSubmit} class="flex flex-1 flex-col">
				<!-- ===================================== -->
				<!-- STEP 1 — EMAIL / USERNAME              -->
				<!-- ===================================== -->

				{#if step === 'email'}
					<div class="mt-[80px] md:mt-14">
						<div class="flex items-center gap-3 md:gap-4">
							<!-- EMAIL ICON -->
							<svg
								class="h-7 w-7 shrink-0 text-[#e4dbf7] md:h-9 md:w-9"
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden="true"
							>
								<rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" />
								<path
									d="m4.5 8 7.5 5.5L19.5 8"
									stroke="#3b2a80"
									stroke-width="1.6"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>

							<!-- INPUT -->
							<div class="flex flex-1 border-b border-white/50 pb-1 md:pb-2">
								<input
									type={useUsername ? 'text' : 'email'}
									bind:value={email}
									placeholder={useUsername ? 'Username' : 'Email'}
									autocomplete={useUsername ? 'username' : 'email'}
									aria-label={useUsername ? 'Username' : 'Email'}
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

						<!-- USE USERNAME / USE EMAIL -->
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

					<!-- ===================================== -->
					<!-- STEP 2 — VERIFY OTP                    -->
					<!-- ===================================== -->
				{:else if step === 'otp'}
					<p
						class="
							mt-10
							text-center
							font-mono
							text-[11px]
							leading-relaxed
							text-white/60

							md:mt-6
							md:text-[13px]
						"
					>
						An OTP has been sent to your email<br />
						Please enter the OTP to verify.
					</p>

					<div class="mt-10 flex justify-center gap-4 md:mt-14 md:gap-6">
						{#each { length: 4 } as _, i}
							<input
								bind:this={otpInputs[i]}
								type="text"
								inputmode="numeric"
								maxlength="1"
								autocomplete={i === 0 ? 'one-time-code' : 'off'}
								aria-label={`OTP digit ${i + 1}`}
								value={otp[i]}
								oninput={(event) => handleOtpInput(event, i)}
								onkeydown={(event) => handleOtpKeydown(event, i)}
								onpaste={handleOtpPaste}
								class="
									h-12 w-12
									rounded-full
									border-2 border-purple-600
									bg-transparent
									p-0
									text-center
									text-[22px]
									text-white
									outline-none
									transition-colors
									focus:border-fuchsia-400
									focus:ring-0

									md:h-14 md:w-14
								"
							/>
						{/each}
					</div>

					<!-- ===================================== -->
					<!-- STEP 3 — UPDATE PASSWORD               -->
					<!-- ===================================== -->
				{:else}
					<!-- PASSWORD -->
					<div class="mt-[80px] flex items-center gap-4 md:mt-10 md:gap-5">
						{@render lockIcon()}

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

							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="
									absolute
									top-0
									right-0
									text-white/60
									transition-opacity
									hover:text-white
								"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{@render eyeIcon(showPassword)}
							</button>
						</div>
					</div>

					<!-- CONFIRM PASSWORD -->
					<div class="mt-10 flex items-center gap-4 md:mt-8 md:gap-5">
						{@render lockIcon()}

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

							<button
								type="button"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
								class="
									absolute
									top-0
									right-0
									text-white/60
									transition-opacity
									hover:text-white
								"
								aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
							>
								{@render eyeIcon(showConfirmPassword)}
							</button>
						</div>
					</div>
				{/if}

				<!-- ===================================== -->
				<!-- BOTTOM: BUTTON + LINKS (pinned down)   -->
				<!-- ===================================== -->

				<div class="mt-auto flex flex-col">
					<button
						type="submit"
						class="
							w-full
							rounded-full
							bg-fuchsia-600
							py-2
							text-[15px]
							font-medium
							text-white
							transition
							hover:bg-red-500
							active:scale-[0.99]

							md:rounded-[10px]
							md:py-2
							md:text-[24px]
							md:shadow-[0_4px_18px_rgba(168,85,247,0.25)]
						"
					>
						{#if step === 'email'}
							<span class="md:hidden">Get OTP</span>
							<span class="hidden md:inline">Log in</span>
						{:else if step === 'otp'}
							<span class="md:hidden">Verify</span>
							<span class="hidden md:inline">Log in</span>
						{:else}
							Update Password
						{/if}
					</button>

					{#if step === 'email'}
						<!-- MOBILE SIGN UP -->
						<p class="mt-2 text-center text-[10px] text-white/60 md:hidden">
							Don't have an account?
							<a
								href={resolve('/auth/signup')}
								class="text-fuchsia-500 underline underline-offset-2"
							>
								Sign Up
							</a>
						</p>

						<!-- DESKTOP RESET PASSWORD -->
						<div class="mt-5 hidden text-center text-[13px] md:block">
							<span class="text-white/60"> Forgot Password ? </span>

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
					{:else if step === 'otp'}
						<p class="mt-2 text-center text-[10px] text-white/60 md:mt-5 md:text-[13px]">
							Didn't receive OTP?
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
									console.log('Resend OTP clicked');
								}}
							>
								resend
							</button>
						</p>
					{/if}
				</div>
			</form>
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

