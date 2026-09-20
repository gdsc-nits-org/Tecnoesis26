<script lang="ts">
    import { onMount } from 'svelte';

    let section: HTMLElement;
    let progress = $state(0);

    onMount(() => {
        let frame = 0;
        const updateProgress = () => {
            frame = 0;
            if (!section) return;
            const bounds = section.getBoundingClientRect();
            const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
            progress = Math.min(Math.max(-bounds.top / travel, 0), 1);
        };
        const handleScroll = () => {
            if (!frame) frame = requestAnimationFrame(updateProgress);
        };

        updateProgress();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    });
</script>

<section bind:this={section} class="about-section" style={`--about-progress: ${progress}`}>
    <!-- Sticky Viewport Wrapper -->
    <div class="sticky-viewport">
        
        <!-- 3-Block Track Layout (Total Width: 150vw) -->
        <div class="about-track">
            
            <!-- SUBSECTION 1: About Tecnoesis -->
            <div class="sub-block text-block">
                <div class="about-text">
                    <h2 class="about-title">About Tecnoesis</h2>
                    <div class="about-description">
                        <p>
                            Tecnoesis is the Annual Techno-Managerial Event of NIT Silchar, Promising All Tech
                            Geeks The Ideal Niche Of Fascinating Events, Workshops, Competitions And Interactions
                            Worth A Lifetime.
                        </p>
                    </div>
                </div>
            </div>

            <!-- SUBSECTION 2: The 3D GIF (Normal Flow Item in Center) -->
            <div class="sub-block gif-block">
                <img src="/IMG_8774.GIF" alt="3D Sphere visualization" class="sphere-img" />
            </div>

            <!-- SUBSECTION 3: What Awaits You -->
            <div class="sub-block text-block">
                <div class="about-text">
                    <h2 class="about-title">What Awaits You</h2>
                    <div class="about-description">
                        <p>
                            Dive into a world of cutting-edge technology, mind-bending competitions, and
                            electrifying workshops. From robotics to coding challenges, from hackathons to guest
                            lectures by industry leaders — Tecnoesis brings together the brightest minds from
                            across the nation.
                        </p>
                        <p class="highlight-text">
                            3 Days • 50+ Events • 10,000+ Participants • Infinite Possibilities
                        </p>
                    </div>
                </div>
            </div>

        </div>

        <!-- Slide Indicators -->
        <div class="slide-dots">
            <span class="dot" class:active={progress < 0.5}></span>
            <span class="dot" class:active={progress >= 0.5}></span>
        </div>

    </div>
</section>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Sulphur+Point:wght@300;400;700&display=swap');

    @font-face {
        font-family: 'Delicatus';
        src: url('/Delicatus.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    .about-section {
        position: relative;
        height: 200vh;
        width: 100%;
        z-index: 2;
        overflow-x: clip;
    }

    .sticky-viewport {
        position: sticky;
        top: 0;
        height: 100vh;
        width: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    /* ───── 3-Subsection Track System ───── */
    .about-track {
        display: flex;
        height: 100vh;
        width: 150vw; /* 3 blocks * 50vw each = 150vw */
        /* Shifts track left by 50vw as progress goes from 0 to 1 */
        transform: translateX(calc(var(--about-progress) * -50vw));
        will-change: transform;
    }

    /* Each subsection takes exactly 50vw of the viewport width */
    .sub-block {
        flex: 0 0 50vw;
        width: 50vw;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        box-sizing: border-box;
    }

    /* ───── Subsection 2: GIF Image ───── */
    .gif-block {
        position: relative;
        z-index: 10;
    }

    .sphere-img {
        width: clamp(380px, 38vw, 750px);
        height: clamp(380px, 38vw, 750px);
        object-fit: cover;
        border-radius: 50%;
        filter: drop-shadow(0 0 40px rgba(130, 80, 255, 0.35));
        animation: sphere-float 6s ease-in-out infinite;
    }

    @keyframes sphere-float {
        0%,
        100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-14px) rotate(2deg);
        }
    }

    /* ───── Shared Text Box Styles ───── */
    .about-text {
        width: 100%;
        max-width: 580px;
        z-index: 15;
    }

    .about-title {
        font-family: 'Delicatus', sans-serif;
        font-size: clamp(2.2rem, 3.8vw, 2.6rem);
        font-weight: 700;
        color: white;
        margin: 0 0 1.5rem 0;
        padding: 0.5rem 1rem;
        border: 1px solid rgba(255, 255, 255, 0.25);
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(4px);
        border-radius: 5px;
    }

    .about-description {
        border: 1px solid rgba(255, 255, 255, 0.18);
        padding: 1.5rem 1.8rem;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(6px);
        border-radius: 5px;
    }

    .about-description p {
        margin: 0;
        font-family: 'Bruno Ace', sans-serif;
        font-size: clamp(0.85rem, 1.3vw, 1.25rem);
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.88);
        font-weight: 400;
        text-align: justify;
    }

    .highlight-text {
        margin-top: 1.2rem !important;
        font-size: clamp(0.85rem, 1.1vw, 1.05rem) !important;
        color: rgba(200, 170, 255, 0.95) !important;
        font-weight: 700 !important;
        text-align: center !important;
        letter-spacing: 0.06em;
    }

    /* ───── Slide Dots ───── */
    .slide-dots {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.6rem;
        z-index: 25;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.4);
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .dot.active {
        background: rgba(255, 255, 255, 0.85);
        transform: scale(1.2);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
    }

    @media (max-width: 980px) {
        .sub-block {
            padding: 1rem;
        }
        .sphere-img {
            width: 300px;
            height: 300px;
        }
    }
</style>