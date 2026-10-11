import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export type PortalStage = 'idle' | 'charging' | 'warping' | 'navigating' | 'revealing';

class PortalTransitionManager {
	isActive = $state(false);
	stage = $state<PortalStage>('idle');
	destination = $state<string>('/home');
	progress = $state(0);
	statusText = $state('INITIALIZING SYSTEM');

	private progressInterval: ReturnType<typeof setInterval> | null = null;
	private timers: Array<ReturnType<typeof setTimeout>> = [];

	private clearTimers() {
		if (this.progressInterval) {
			clearInterval(this.progressInterval);
			this.progressInterval = null;
		}
		this.timers.forEach((t) => clearTimeout(t));
		this.timers = [];
	}

	start(targetUrl: string = '/home') {
		if (this.isActive) return;
		this.clearTimers();

		this.isActive = true;
		this.destination = targetUrl;
		this.stage = 'charging';
		this.progress = 0;
		this.statusText = 'INITIALIZING WARP GATEWAY';

		const startTime = performance.now();
		const totalWarpTime = 1100; // time until navigation

		// Smooth progress animation from 0% to 100%
		this.progressInterval = setInterval(() => {
			const elapsed = performance.now() - startTime;
			const p = Math.min(100, (elapsed / totalWarpTime) * 100);
			this.progress = Math.round(p);
			if (p >= 100 && this.progressInterval) {
				clearInterval(this.progressInterval);
				this.progressInterval = null;
			}
		}, 16);

		// Stage 1 -> Stage 2: Hyperspace warp tunnel engages
		this.timers.push(
			setTimeout(() => {
				this.stage = 'warping';
				this.statusText = 'HYPERSPACE VELOCITY ENGAGED · TECNOESIS 2026';
			}, 240)
		);

		// Stage 2 -> Stage 3: Peak radiance + SvelteKit navigation executes
		this.timers.push(
			setTimeout(() => {
				this.stage = 'navigating';
				this.statusText = 'SYNCHRONIZING WITH FESTIVAL MAINSTAGE';
				void goto(resolve(this.destination as any));
			}, 1100)
		);

		// Stage 3 -> Stage 4: Reveal destination page smoothly
		this.timers.push(
			setTimeout(() => {
				this.stage = 'revealing';
				this.statusText = 'ACCESS GRANTED';
			}, 1500)
		);

		// Stage 4 -> Idle: Clean completion
		this.timers.push(
			setTimeout(() => {
				this.isActive = false;
				this.stage = 'idle';
				this.progress = 0;
				this.clearTimers();
			}, 2200)
		);
	}
}

export const portalTransition = new PortalTransitionManager();
