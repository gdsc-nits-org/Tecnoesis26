<script lang="ts">
	import { resolve } from '$app/paths';

	let fullName = $state('');
	let email = $state('');
	let phone = $state('');
	let hostel = $state('');
	let gender = $state('');

	function handleUpdate() {
		console.log({
			fullName,
			email,
			phone,
			hostel,
			gender
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

		max-md:h-screen
		max-md:overflow-y-auto
		max-md:overflow-x-hidden

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

			max-md:h-auto
			max-md:min-h-screen
			max-md:items-start
			max-md:overflow-visible
			max-md:pb-12
		"
	>
		<!-- ================================================= -->
		<!-- PROFILE CARD                                      -->
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

				max-md:h-auto
				max-md:min-h-[calc(100vh-5rem)]
				max-md:overflow-visible
				max-md:rounded-[24px]
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
			<!-- FORM                                               -->
			<!-- ================================================= -->

			<form
				onsubmit={(event) => {
					event.preventDefault();
					handleUpdate();
				}}
				class="
					relative
					z-10
					mt-7
					flex
					flex-1
					flex-col

					md:mt-5
				"
			>
				<!-- ================================================= -->
				<!-- FORM GRID                                         -->
				<!-- ================================================= -->

				<div
					class="
						grid
						grid-cols-1
						gap-4

						sm:gap-5

						md:grid-cols-2
						md:gap-x-[36px]
						md:gap-y-5
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
					<!-- EMAIL                                               -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="email"
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
							Email
						</label>

						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="Institute Email"
							autocomplete="email"
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

						<span
							class="
								pl-1
								text-[9px]
								text-white/45

								sm:text-[10px]

								md:text-[11px]
							"
						>
							Institute email only
						</span>
					</div>

					<!-- ================================================= -->
					<!-- PHONE                                               -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="phone"
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
							id="phone"
							type="tel"
							bind:value={phone}
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
					<!-- HOSTEL                                              -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="hostel"
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
							id="hostel"
							type="text"
							bind:value={hostel}
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

					<!-- ================================================= -->
					<!-- GENDER                                              -->
					<!-- ================================================= -->

					<div class="flex flex-col gap-1.5">
						<label
							for="gender"
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
							Gender
						</label>

						<select
							id="gender"
							bind:value={gender}
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

								transition

								focus:border-[#c05aff]
								focus:ring-2
								focus:ring-fuchsia-400/15

								sm:h-[48px]
								sm:text-[16px]

								md:h-[53px]
								md:text-[18px]
							"
						>
							<option value="" disabled class="bg-fuchsia-500">
								Select Gender
							</option>

							<option value="Male" class="bg-[#351878]">
								Male
							</option>

							<option value="Female" class="bg-[#351878]">
								Female
							</option>

							<option value="Other" class="bg-[#351878]">
								Other
							</option>

							<option value="Prefer not to say" class="bg-[#351878]">
								Prefer not to say
							</option>
						</select>
					</div>
				</div>

				<!-- ================================================= -->
				<!-- COMPLETE BUTTON                                   -->
				<!-- ================================================= -->

				<div
					class="
						flex
						justify-center

						mt-8

						md:mt-auto
						md:pt-8
					"
				>
					<button
						type="submit"
						class="
							h-[44px]
							w-full
							max-w-[260px]
							rounded-[7px]
							border
							border-fuchsia-300/50
							bg-[#a22ef0]
							px-4
							text-[17px]
							font-semibold
							text-white

							transition
							duration-200

							hover:bg-red-500
							hover:shadow-[0_0_18px_rgba(168,85,247,0.25)]

							active:scale-[0.99]

							sm:h-[46px]
							sm:max-w-[280px]
							sm:text-[18px]

							md:h-[42px]
							md:max-w-[316px]
							md:text-[20px]
						"
					>
						Complete
					</button>
				</div>
			</form>
		</div>
	</main>
</div>

