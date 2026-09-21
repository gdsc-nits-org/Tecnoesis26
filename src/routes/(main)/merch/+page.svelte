<script lang="ts">
	import MerchButton from "$lib/components/MerchButton.svelte";
	import merchPageElement from "$lib/assets/MerchPageElement.svg";
	import merchPageElementReverse from "$lib/assets/MerchPageElementReverse.svg";
	import Partiton from "$lib/assets/MerchdetailPartition.svg";

	// Define TypeScript type for sizes
	type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
	type Style = 'Tecno' | 'Spark' ;

	// State for size selection and quantity counter
	let selectedSize: Size = $state('M');
	let selectedStyle: Style = $state('Tecno');
    let selectedStyles: Style[] = $state([]);

	const sizes: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];
	const styles: Style[] = ['Tecno', 'Spark'];


	function handleSizeSelect(size: Size): void {
		selectedSize = size;
	}

	function handleStyleSelect(style: Style): void {
		selectedStyle = style;
	}

    function handleCheckboxChange(style: Style, event: Event): void {
        const target = event.target as HTMLInputElement;
        
        if (target.checked) {
        // Add style if checked
        if (!selectedStyles.includes(style)) {
            selectedStyles.push(style);
        }
        } else {
        // Remove style if unchecked
        selectedStyles = selectedStyles.filter(s => s !== style);
        }
    }
</script>
<main
    class="fixed inset-0 overflow-y-auto bg-[url('/GalleryBgImg.png')] bg-cover bg-center bg-no-repeat select-none font-game-demo md:flex md:items-center md:justify-center md:overflow-hidden"
>
    <div class="absolute left-5 top-5 z-10 m-0 md:left-15 md:top-19 md:m-4">
        <div class="h-auto w-36 md:h-[10%] md:w-[12%]">
            <img src="/TecnoLogoFull.png" alt="Tecnoesis Logo" srcset="">
        </div>
    </div>
    <div class="absolute left-5 top-24 z-10 m-0 hidden md:left-20 md:top-35 md:m-4 md:block">
        <div class="mt-2 h-[10%] w-[60%]">
            <img src={merchPageElement} alt="Merch page element">
        </div>
        
    </div>
    <div class="absolute bottom-60 right-6 z-10 w-40 md:hidden">
        <img src={merchPageElementReverse} alt="Merch page element" class="w-full">
    </div>
    <div class="relative left-1/2 top-26 md:top-30 h-[60%] w-[60%] md:w-[30%] -translate-x-1/2  md:relative md:left-auto md:top-auto md:translate-x-0 md:bottom-10 md:mx-0 flex items-center justify-center">
        <img src="/MerchPic.png" alt="Tecnoesis Merch T-shirt" class="w-full h-auto">
    </div>
    <div class="relative top-25 mb-6 mt-3 flex flex-col items-center text-center font-bankgothic text-white md:hidden">
        <h2 class="mb-3 text-xl">STYLE</h2>
        <div class="flex items-center justify-center gap-[clamp(0.75rem,4vw,1.5rem)]">
            {#each styles as style}
                <button
                    type="button"
                    aria-label={`Select ${style} style`}
                    aria-pressed={selectedStyle === style}
                    onclick={() => handleStyleSelect(style)}
                    class="group relative h-[clamp(2.75rem,15vw,4.5rem)] w-[clamp(2.75rem,15vw,4.5rem)] shrink-0 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                    <span
                        class="absolute inset-0 bg-[#f4f0ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
                    ></span>
                    <span
                        class={`absolute inset-[2px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] ${
                            selectedStyle === style ? 'bg-[#3155bd]' : 'bg-[#24164f]'
                        }`}
                    ></span>
                </button>
            {/each}
        </div>
    </div>
    <div class="relative mx-4 mb-6 mt-44 w-auto rounded-2xl md:border-2 md:border-white/40 md:bg-[#8B75D933] md:backdrop-blur-[20%] p-6 pb-5 font-bankgothic text-white md:absolute md:right-6 md:top-1/2 md:mx-0 md:mb-0 md:mt-0 md:w-[30%] md:-translate-y-1/2 md:p-3 md:pb-3 lg:right-20 lg:w-[20%] lg:p-6 lg:pb-0">
        <div class="m-2 flex h-auto items-center justify-center">
            <img src={Partiton} alt="Partition Icon" class="max-w-full">
        </div>
        <div class="m-2 text-center">
            <h1 class="mt-4 text-2xl md:text-lg lg:text-2xl">DETAILS</h1>
            <span class="mt-2 block text-xs md:text-[10px] lg:text-xs">
                Not just a T-shirt. This is a limited-edition Tron-inspired drop built for comfort, style, and pure futuristic vibes. Glow with the energy of Tecno Fest — once it’s gone, it’s gone.
            </span>
        </div>
        <div class="m-2 flex h-auto items-center justify-center">
            <img src={Partiton} alt="Partition Icon" class="max-w-full">
        </div>
        <div class="mb-8 mt-8 text-center md:mb-10 md:mt-10">
            <h2 class="mb-3 text-xl md:text-base lg:text-xl">SIZE</h2>
            <div class="flex items-center justify-center gap-2 md:gap-0 lg:gap-2">
                {#each sizes as size}
                    <button
                        type="button"
                        aria-label={`Select size ${size}`}
                        aria-pressed={selectedSize === size}
                        onclick={() => handleSizeSelect(size)}
                        class="group relative h-10 w-10 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:h-9 md:w-9 lg:h-12 lg:w-12"
                    >
                        <span
                            class="absolute inset-0 bg-[#f4f0ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
                        ></span>
                        <span
                            class={`absolute inset-[2px] flex items-center justify-center font-bankgothic text-xs font-bold text-white [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] ${
                                selectedSize === size
                                    ? 'bg-[#3e57b8]'
                                    : 'bg-[#24164f] transition-colors group-hover:bg-[#4d397e]'
                            }`}
                        >
                            {size}
                        </span>
                    </button>
                {/each}
            </div>
            <div class="m-2 flex h-auto items-center justify-center">
                <img src={Partiton} alt="Partition Icon" class="max-w-full">
            </div>
            <div class="hidden md:block">
                <h2 class="mb-3 mt-8 text-xl md:text-base lg:text-xl">STYLE</h2>
                <div class="flex items-center justify-center gap-6 md:gap-5 lg:gap-6">
                    {#each styles as style}
                        <button
                            type="button"
                            aria-label={`Select ${style} style`}
                            aria-pressed={selectedStyle === style}
                            onclick={() => handleStyleSelect(style)}
                            class="group relative h-30 w-30 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:h-12 md:w-12 lg:h-15 lg:w-15"
                        >
                            <span
                                class="absolute inset-0 bg-[#f4f0ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
                            ></span>
                            <span
                                class={`absolute inset-[2px] flex items-center justify-center [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] ${
                                    selectedStyle === style ? 'bg-[#3155bd]' : 'bg-[#24164f]'
                                }`}
                            >
        
                            </span>
                        </button>
                    {/each}
                </div>
            </div>
            <div class="m-2 flex h-auto items-center justify-center">
                <img src={Partiton} alt="Partition Icon" class="max-w-full">
            </div>
            <div class="">
                <h2 class="mb-3 mt-8 text-xl md:text-base lg:text-xl">WHICH ONE DO YOU WANT?</h2>
                <div class="flex justify-center gap-6">
                    {#each styles as style}
                        <label class="flex cursor-pointer items-center gap-2 text-sm uppercase">
                            <input
                                type="checkbox"
                                value={style}
                                checked={selectedStyles.includes(style)}
                                onchange={(e) => handleCheckboxChange(style, e)}
                                class="h-4 w-4 accent-[#3155bd] focus:outline-none focus:ring-2 focus:ring-white/80"
                            />
                            <span>{style}</span>
                        </label>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <div class="relative mx-4 mb-8 flex h-auto flex-col items-center justify-center gap-3 md:absolute md:bottom-16 md:left-1/2 md:mx-0 md:w-[30%] md:-translate-x-1/2 md:flex-row md:justify-between">
        <MerchButton label="Enter Name" />
        <MerchButton label="Order Now" />
    </div>
</main>