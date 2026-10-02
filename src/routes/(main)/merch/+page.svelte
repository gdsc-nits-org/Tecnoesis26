<script lang="ts">
	import MerchButton from '$lib/components/MerchButton.svelte';
	import merchPageElement from '$lib/assets/MerchPageElement.svg';
	import merchPageElementReverse from '$lib/assets/MerchPageElementReverse.svg';
	import Partiton from '$lib/assets/MerchdetailPartition.svg';
	import price450 from '$lib/assets/Price450.png';
	import price850 from '$lib/assets/Price850.png';

	type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
	type Style = 'Tecno' | 'Spark';
	type ShirtChoice = Style | 'Both';

	const sizes: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];
	const styles: Style[] = ['Tecno', 'Spark'];
	let { data, form } = $props();

	const storedChoice = $derived((data.merchRecord?.choice as ShirtChoice | undefined) ?? 'Tecno');
	const storedSize = $derived(
		data.merchRecord?.size && sizes.includes(data.merchRecord.size as Size)
			? (data.merchRecord.size as Size)
			: 'M'
	);
	const hasStoredOptIn = $derived(data.merchRecord?.optedIn ?? false);

	let shirtChoiceOverride = $state<ShirtChoice | null>(null);
	let sizeOverride = $state<Size | null>(null);
	let styleOverride = $state<Style | null>(null);
	const selectedSize = $derived(sizeOverride ?? storedSize);
	const shirtChoice = $derived(shirtChoiceOverride ?? storedChoice);
	const selectedStyle = $derived(styleOverride ?? (shirtChoice === 'Spark' ? 'Spark' : 'Tecno'));

	const optInButtonLabel = $derived.by(() => {
		if (form?.success) {
			return shirtChoice === form.choice && selectedSize === form.size
				? 'Opted In'
				: 'Update Details';
		}
		if (!hasStoredOptIn) return 'Opt In';
		return shirtChoice === storedChoice && selectedSize === storedSize
			? 'Opted In'
			: 'Update Details';
	});
	const productDetails: Record<Style, string> = {
		Tecno:
			'Not just a T-shirt. This is a limited-edition city-inspired drop built for comfort and everyday wear.',
		Spark:
			'A bold, cosmic graphic made for the curious. Wear the Spark design and carry the energy with you.'
	};

	function handleSizeSelect(size: Size): void {
		sizeOverride = size;
	}

	function handleStyleSelect(style: Style): void {
		styleOverride = style;
	}

	function handleShirtChoice(choice: ShirtChoice): void {
		shirtChoiceOverride = choice;
		styleOverride = null;
	}

	function changeStyle(direction: -1 | 1): void {
		const currentIndex = styles.indexOf(selectedStyle);
		styleOverride = styles[(currentIndex + direction + styles.length) % styles.length];
	}
</script>

<main
	class="fixed inset-0 overflow-y-auto bg-[url('/GalleryBgImg.png')] bg-cover bg-center bg-no-repeat font-game-demo select-none md:flex md:items-center md:justify-center md:overflow-hidden"
>
	<div class="absolute top-24 left-5 z-10 m-0 hidden md:top-35 md:left-20 md:m-4 md:block">
		<div class="mt-2 h-[10%] w-[60%]">
			<img src={merchPageElement} alt="Merch page element" />
		</div>
	</div>
	<div class="absolute right-6 bottom-60 z-10 w-40 md:hidden">
		<img src={merchPageElementReverse} alt="Merch page element" class="w-full" />
	</div>

	<div
		class="relative top-26 left-1/2 flex h-[60%] w-[60%] -translate-x-1/2 items-center justify-center md:relative md:top-auto md:bottom-10 md:left-auto md:mx-0 md:w-[30%] md:translate-x-0"
	>
		<button
			type="button"
			aria-label="Show previous shirt"
			onclick={() => changeStyle(-1)}
			class="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-[#24164f]/80 text-2xl text-white transition-colors hover:bg-[#3e57b8] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none md:-left-5"
		>
			<span aria-hidden="true">‹</span>
		</button>
		<img
			src={selectedStyle === 'Tecno' ? '/tecno-back.png' : '/spark-back.png'}
			alt={`${selectedStyle} T-shirt, back view`}
			class="h-auto w-full"
		/>
		<button
			type="button"
			aria-label="Show next shirt"
			onclick={() => changeStyle(1)}
			class="absolute top-1/2 right-0 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-[#24164f]/80 text-2xl text-white transition-colors hover:bg-[#3e57b8] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none md:-right-5"
		>
			<span aria-hidden="true">›</span>
		</button>
	</div>

	<div
		class="relative top-25 mt-3 mb-6 flex flex-col items-center text-center font-bankgothic text-white md:hidden"
	>
		<h2 class="mb-3 text-xl">STYLE</h2>
		<div class="flex items-center justify-center gap-[clamp(0.75rem,4vw,1.5rem)]">
			{#each styles as style (style)}
				<button
					type="button"
					aria-label={`Select ${style} style`}
					aria-pressed={selectedStyle === style}
					onclick={() => handleStyleSelect(style)}
					class="group relative h-[clamp(2.75rem,15vw,4.5rem)] w-[clamp(2.75rem,15vw,4.5rem)] shrink-0 transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none"
				>
					<span
						class="absolute inset-0 bg-[#f4f0ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
					></span>
					<span
						class="absolute inset-[2px] overflow-hidden bg-[#24164f] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
					>
						<img
							src={style === 'Tecno' ? '/tecno-back.png' : '/spark-back.png'}
							alt=""
							class="h-full w-full object-cover object-center"
						/>
					</span>
				</button>
			{/each}
		</div>
	</div>

	<div
		class="relative mx-4 mt-44 mb-6 w-auto rounded-2xl p-6 pb-5 font-bankgothic text-white md:absolute md:top-1/2 md:right-6 md:mx-0 md:mt-0 md:mb-0 md:w-[30%] md:-translate-y-1/2 md:border-2 md:border-white/40 md:bg-[#8B75D933] md:p-3 md:pb-3 md:backdrop-blur-[20%] lg:right-20 lg:w-[20%] lg:p-6 lg:pb-0"
	>
		<form method="POST" action="?/optIn" class="flex flex-col">
			<div class="m-2 flex h-auto items-center justify-center">
				<img src={Partiton} alt="" class="max-w-full" />
			</div>
			<div class="m-2 text-center">
				<h1 class="mt-4 text-2xl md:text-lg lg:text-2xl">
					{selectedStyle.toUpperCase()} / DETAILS
				</h1>
				<span class="mt-2 block text-xs md:text-[10px] lg:text-xs">
					{productDetails[selectedStyle]}
				</span>
			</div>
			<div class="m-2 flex h-auto items-center justify-center">
				<img src={Partiton} alt="" class="max-w-full" />
			</div>
			<div class="mt-8 mb-8 text-center md:mt-10 md:mb-10">
				<h2 class="mb-3 text-xl md:text-base lg:text-xl">SIZE</h2>
				<div class="flex items-center justify-center gap-2 md:gap-0 lg:gap-2">
					{#each sizes as size (size)}
						<button
							type="button"
							aria-label={`Select size ${size}`}
							aria-pressed={selectedSize === size}
							onclick={() => handleSizeSelect(size)}
							class="group relative h-10 w-10 transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none md:h-9 md:w-9 lg:h-12 lg:w-12"
						>
							<span
								class="absolute inset-0 bg-[#f4f0ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
							></span>
							<span
								class={`absolute inset-[2px] flex items-center justify-center font-bankgothic text-xs font-bold text-white [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] ${selectedSize === size ? 'bg-[#3e57b8]' : 'bg-[#24164f] transition-colors group-hover:bg-[#4d397e]'}`}
								>{size}</span
							>
						</button>
					{/each}
				</div>
				<div class="m-2 flex hidden h-auto items-center justify-center md:block">
					<img src={Partiton} alt="" class="max-w-full" />
				</div>
				<div class="hidden md:block">
					<h2 class="mt-8 mb-3 text-xl md:text-base lg:text-xl">STYLE</h2>
					<div class="flex items-center justify-center gap-6 md:gap-5 lg:gap-6">
						{#each styles as style (style)}
							<button
								type="button"
								aria-label={`Select ${style} style`}
								aria-pressed={selectedStyle === style}
								onclick={() => handleStyleSelect(style)}
								class="group relative h-30 w-30 transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none md:h-12 md:w-12 lg:h-15 lg:w-15"
							>
								<span
									class="absolute inset-0 bg-[#f4f0ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
								></span>
								<span
									class="absolute inset-[2px] overflow-hidden bg-[#24164f] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
								>
									<img
										src={style === 'Tecno' ? '/tecno-back.png' : '/spark-back.png'}
										alt=""
										class="h-full w-full object-cover object-center"
									/>
								</span>
							</button>
						{/each}
					</div>
				</div>
				<div class="m-2 flex h-auto items-center justify-center">
					<img src={Partiton} alt="" class="max-w-full" />
				</div>
				<div>
					<h2 class="mt-8 mb-3 text-xl md:text-base lg:text-xl">WHICH ONE DO YOU WANT?</h2>
					<div
						class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs uppercase md:gap-x-3 md:text-[10px]"
					>
						{#each ['Tecno', 'Spark', 'Both'] as choice (choice)}
							<label class="flex cursor-pointer items-center gap-1.5 whitespace-nowrap">
								<input
									type="radio"
									name="shirt_choice"
									value={choice}
									checked={shirtChoice === choice}
									onchange={() => handleShirtChoice(choice as ShirtChoice)}
									class="h-4 w-4 accent-[#3155bd] focus:ring-2 focus:ring-white/80 focus:outline-none"
								/>
								<span>{choice}</span>
							</label>
						{/each}
					</div>
					<img
						src={shirtChoice === 'Both' ? price850 : price450}
						alt={shirtChoice === 'Both' ? 'Both shirts: 850 rupees' : 'One shirt: 450 rupees'}
						class="mx-auto mt-3 block w-[min(100%,220px)] md:w-[min(100%,160px)]"
					/>
					<input type="hidden" name="size" value={selectedSize} />
					<div class="mt-4 flex justify-center">
						<MerchButton label={optInButtonLabel} type="submit" />
					</div>
					<p class="mt-2 min-h-5 text-center text-xs" role="status" aria-live="polite">
						{form?.error ?? form?.message ?? ''}
					</p>
				</div>
			</div>
		</form>
	</div>
</main>
