<script lang="ts">
	let { label = '' } = $props<{ label?: string }>();
</script>

<button
	type="button"
	aria-label={label}
	class="group relative h-11 w-40 transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#32176f]"
>
	<span
		class="absolute inset-0 bg-black [clip-path:polygon(8%_0%,42%_0%,46%_8%,54%_8%,58%_0%,92%_0%,100%_50%,92%_100%,58%_100%,54%_92%,46%_92%,42%_100%,8%_100%,0%_50%)]"
	></span>
	<span
		class="absolute inset-[3px] flex items-center justify-center bg-[#a99be8] px-3 font-bankgothic text-base font-bold tracking-wide text-[#090817] transition-colors duration-200 group-hover:bg-[#c0b6f2] [clip-path:polygon(8%_0%,42%_0%,46%_8%,54%_8%,58%_0%,92%_0%,100%_50%,92%_100%,58%_100%,54%_92%,46%_92%,42%_100%,8%_100%,0%_50%)]"
	>
		{label}
	</span>
</button>