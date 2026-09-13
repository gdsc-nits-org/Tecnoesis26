<div class="relative flex justify-center items-center w-[150px] h-[120px] md:w-[200px] md:h-[160px] shrink-0 font-['Doto'] mx-auto group cursor-pointer">
    
    <!-- Floating bracket corners - they move closer on hover via group-hover -->
    <div class="absolute top-0 left-0 w-2.5 h-2.5 md:w-3 md:h-3 border-t border-l border-white/50 transition-all duration-300 ease-out group-hover:top-2 group-hover:left-2 md:group-hover:top-3 md:group-hover:left-3"></div>
    <div class="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 border-t border-r border-white/50 transition-all duration-300 ease-out group-hover:top-2 group-hover:right-2 md:group-hover:top-3 md:group-hover:right-3"></div>
    <div class="absolute bottom-0 left-0 w-2.5 h-2.5 md:w-3 md:h-3 border-b border-l border-white/50 transition-all duration-300 ease-out group-hover:bottom-2 group-hover:left-2 md:group-hover:bottom-3 md:group-hover:left-3"></div>
    <div class="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 border-b border-r border-white/50 transition-all duration-300 ease-out group-hover:bottom-2 group-hover:right-2 md:group-hover:bottom-3 md:group-hover:right-3"></div>
    
    <!-- Main Circular Button -->
    <!-- Turns completely blue on hover -->
    <div class="relative w-[110px] h-[110px] md:w-[145px] md:h-[145px] rounded-full bg-[#f0f2f5] border-[3px] md:border-[4px] border-[#f0f2f5] flex flex-col justify-center items-center transition-colors duration-300 ease-out group-hover:bg-[#4a6be8] group-hover:border-[#4a6be8] shadow-[0_0_20px_rgba(255,255,255,0.1)] z-10">
        
        <!-- The thin inner line -->
        <!-- Changes to white on hover -->
        <div class="absolute inset-[2px] md:inset-[3px] rounded-full border border-[#a0a0a0] pointer-events-none transition-colors duration-300 ease-out group-hover:border-white"></div>

        <!-- Text inside circle -->
        <!-- Changes to white on hover -->
        <div class="text-black text-[20px] md:text-[34px] font-bold leading-[1.0] tracking-[1px] transition-colors duration-300 ease-out m-0 group-hover:text-white z-10">Me</div>
        <div class="text-black text-[20px] md:text-[34px] font-bold leading-[1.0] tracking-[1px] transition-colors duration-300 ease-out m-0 group-hover:text-white z-10">into</div>
    </div>
</div>
