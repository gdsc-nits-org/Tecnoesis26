<script lang="ts">
	import { resolve } from '$app/paths';

	let fullName = $state('');
	let scholarId = $state('');
	let phoneNumber = $state('');
	let hostelNumber = $state('');

	function handleUpdate() {
		console.log({
			fullName,
			scholarId,
			phoneNumber,
			hostelNumber
		});
	}
</script>

<svelte:head>
	<title>Profile | Tecnoesis 2026</title>

	<meta
		name="description"
		content="Manage your Tecnoesis profile"
	/>

	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0"
	/>
</svelte:head>

<div
	class="
		relative
		h-screen
		w-full
		overflow-hidden
		bg-[#25136f]
		bg-[url('/profile-bg.png')]
		bg-cover
		bg-center
		bg-no-repeat
	"
>
	<!-- ================================================= -->
	<!-- BACKGROUND OVERLAY                                -->
	<!-- ================================================= -->

	<div
		class="
			pointer-events-none
			absolute
			inset-0
			z-0
			bg-[#28156f]/10
		"
	></div>

	<!-- ================================================= -->
	<!-- DESKTOP NAVBAR                                    -->
	<!-- ================================================= -->

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
				max-w-[1000px]
				items-center
				justify-between
			"
		>
			<!-- LEFT NAV -->

			<div class="flex items-center gap-10">
				<a
					href={resolve('/')}
					class="
						font-mono
						text-[16px]
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
						font-mono
						text-[16px]
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
						font-mono
						text-[16px]
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
						font-mono
						text-[16px]
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
						font-mono
						text-[16px]
						font-bold
						text-white
						transition-opacity
						hover:opacity-70
					"
				>
					Teams
				</a>
			</div>

			<!-- RIGHT NAV -->

			<div class="flex items-center gap-4">
				<span
					class="
						font-mono
						text-[13px]
						text-white/65
					"
				>
					Already have an account?
				</span>

				<a
					href={resolve('/auth/login')}
					class="
						font-mono
						text-[13px]
						text-fuchsia-500
						transition-opacity
						hover:opacity-75
					"
				>
					Log in
				</a>
			</div>
		</nav>
	</header>

	<!-- ================================================= -->
	<!-- MAIN                                               -->
	<!-- ================================================= -->

	<main
		class="
			relative
			z-10
			flex
			h-screen
			w-full
			items-center
			justify-center
			overflow-hidden
			px-4
			pt-16
			pb-4

			sm:px-6

			md:px-8
			md:pt-24
		"
	>
		<!-- ================================================= -->
		<!-- GLASS CARD                                        -->
		<!-- ================================================= -->

		<div
			class="
				relative
				flex
				h-[calc(100vh-5rem)]
				w-full
				max-w-[1080px]
				flex-col

				overflow-hidden
				rounded-[24px]
				border
				border-white/15
				bg-white/[0.035]
				shadow-none
				backdrop-blur-[16px]

				px-5
				py-7

				sm:px-8
				sm:py-8

				md:h-[700px]
				md:max-h-[calc(100vh-120px)]
				md:rounded-[28px]
				md:px-[70px]
				md:py-[42px]
			"
		>
			<!-- ================================================= -->
			<!-- SUBTLE GLASS EDGE                                -->
			<!-- ================================================= -->

			<div
				class="
					pointer-events-none
					absolute
					inset-0
					rounded-[inherit]
					border
					border-white/[0.04]
				"
			></div>

			<!-- ================================================= -->
			<!-- TITLE                                             -->
			<!-- ================================================= -->

			<h1
				class="
					game-paused
					relative
					z-10
					m-0
					shrink-0
					text-center
					text-[34px]
					leading-none
					tracking-[1px]
					text-white

					sm:text-[38px]

					md:text-[44px]
				"
			>
				Profile
			</h1>

			<!-- ================================================= -->
			<!-- CONTENT                                            -->
			<!-- ================================================= -->

			<div
				class="
					relative
					z-10
					mt-7
					grid
					min-h-0
					flex-1
					grid-cols-1
					items-center

					md:mt-5
					md:grid-cols-[0.9fr_1.35fr]
					md:gap-[75px]
				"
			>
				<!-- ================================================= -->
				<!-- LEFT : PROFILE                                    -->
				<!-- ================================================= -->

				<div
					class="
						flex
						flex-col
						items-center
						justify-center
						md:-translate-y-4
					"
				>
					<!-- PROFILE CIRCLE -->

					<div
						class="
							flex
							h-[105px]
							w-[105px]
							shrink-0
							items-center
							justify-center
							rounded-full
							bg-white/[0.93]

							sm:h-[120px]
							sm:w-[120px]

							md:h-[185px]
							md:w-[185px]
						"
					>
						<svg
							class="
								h-[58px]
								w-[58px]
								text-[#bdbdc3]

								sm:h-[65px]
								sm:w-[65px]

								md:h-[98px]
								md:w-[98px]
							"
							viewBox="0 0 100 100"
							fill="none"
							aria-hidden="true"
						>
							<!-- HEAD -->

							<circle
								cx="50"
								cy="35"
								r="13"
								stroke="currentColor"
								stroke-width="7"
							/>

							<!-- BODY -->

							<path
								d="M25 75C25 61 34 54 50 54C66 54 75 61 75 75"
								stroke="currentColor"
								stroke-width="7"
								stroke-linecap="round"
							/>
						</svg>
					</div>

					<!-- UPDATE BUTTON -->

					<button
						type="button"
						onclick={handleUpdate}
						class="
							mt-4
							h-[42px]
							w-full
							max-w-[210px]
							shrink-0
							rounded-[8px]
							border
							border-fuchsia-300/60
							bg-[#a22ef0]
							px-4
							text-[17px]
							font-semibold
							text-white

							transition
							duration-200
							hover:bg-[#b33aff]
							hover:shadow-[0_0_18px_rgba(168,85,247,0.25)]
							active:scale-[0.99]

							sm:mt-5
							sm:h-[44px]
							sm:max-w-[230px]
							sm:text-[18px]

							md:mt-7
							md:h-[47px]
							md:max-w-[270px]
							md:text-[21px]
						"
					>
						Update Profile
					</button>
				</div>

				<!-- ================================================= -->
				<!-- RIGHT : FORM                                      -->
				<!-- ================================================= -->

				<div
					class="
						flex
						w-full
						flex-col
						justify-center
						gap-4

						sm:gap-5

						md:gap-5
					"
				>
					<!-- ================================================= -->
					<!-- FULL NAME                                           -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="fullName"
							class="
								pl-1
								text-[15px]
								font-medium
								leading-tight
								text-white

								sm:text-[17px]

								md:text-[19px]
							"
						>
							Full Name
						</label>

						<input
							id="fullName"
							type="text"
							bind:value={fullName}
							placeholder="Your Full Name"
							autocomplete="name"
							class="
								h-[44px]
								w-full
								rounded-[6px]
								border
								border-[#9c2cff]
								bg-[rgba(65,32,142,0.72)]
								px-3
								text-[14px]
								font-medium
								text-white
								outline-none
								placeholder:text-white/60

								transition

								focus:border-[#c05aff]
								focus:ring-2
								focus:ring-fuchsia-400/15

								sm:h-[48px]
								sm:text-[16px]

								md:h-[53px]
								md:text-[18px]
							"
						/>
					</div>

					<!-- ================================================= -->
					<!-- SCHOLAR ID                                         -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="scholarId"
							class="
								pl-1
								text-[15px]
								font-medium
								leading-tight
								text-white

								sm:text-[17px]

								md:text-[19px]
							"
						>
							Scholar ID
						</label>

						<input
							id="scholarId"
							type="text"
							bind:value={scholarId}
							placeholder="Your Scholar ID"
							autocomplete="off"
							class="
								h-[44px]
								w-full
								rounded-[6px]
								border
								border-[#9c2cff]
								bg-[rgba(65,32,142,0.72)]
								px-3
								text-[14px]
								font-medium
								text-white
								outline-none
								placeholder:text-white/60

								transition

								focus:border-[#c05aff]
								focus:ring-2
								focus:ring-fuchsia-400/15

								sm:h-[48px]
								sm:text-[16px]

								md:h-[53px]
								md:text-[18px]
							"
						/>
					</div>

					<!-- ================================================= -->
					<!-- PHONE NUMBER                                       -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="phoneNumber"
							class="
								pl-1
								text-[15px]
								font-medium
								leading-tight
								text-white

								sm:text-[17px]

								md:text-[19px]
							"
						>
							Phone Number
						</label>

						<input
							id="phoneNumber"
							type="tel"
							bind:value={phoneNumber}
							placeholder="Your Phone Number"
							autocomplete="tel"
							class="
								h-[44px]
								w-full
								rounded-[6px]
								border
								border-[#9c2cff]
								bg-[rgba(65,32,142,0.72)]
								px-3
								text-[14px]
								font-medium
								text-white
								outline-none
								placeholder:text-white/60

								transition

								focus:border-[#c05aff]
								focus:ring-2
								focus:ring-fuchsia-400/15

								sm:h-[48px]
								sm:text-[16px]

								md:h-[53px]
								md:text-[18px]
							"
						/>
					</div>

					<!-- ================================================= -->
					<!-- HOSTEL NUMBER                                      -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="hostelNumber"
							class="
								pl-1
								text-[15px]
								font-medium
								leading-tight
								text-white

								sm:text-[17px]

								md:text-[19px]
							"
						>
							Hostel Number
						</label>

						<input
							id="hostelNumber"
							type="text"
							bind:value={hostelNumber}
							placeholder="Your Hostel Number"
							autocomplete="off"
							class="
								h-[44px]
								w-full
								rounded-[6px]
								border
								border-[#9c2cff]
								bg-[rgba(65,32,142,0.72)]
								px-3
								text-[14px]
								font-medium
								text-white
								outline-none
								placeholder:text-white/60

								transition

								focus:border-[#c05aff]
								focus:ring-2
								focus:ring-fuchsia-400/15

								sm:h-[48px]
								sm:text-[16px]

								md:h-[53px]
								md:text-[18px]
							"
						/>
					</div>
				</div>
			</div>
		</div>
	</main>
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
		height: 100%;
		overflow: hidden;
	}

	:global(body) {
		background: #25136f;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>