import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export type PortalStage = 'idle' | 'charging' | 'revealing';

class PortalTransitionManager {
	isActive = $state(false);
	stage = $state<PortalStage>('idle');
	progress = $state(0);

	private progressInterval: ReturnType<typeof setInterval> | null = null;
	private navigationTimer: ReturnType<typeof setTimeout> | null = null;
	private revealTimer: ReturnType<typeof setTimeout> | null = null;

	private clearTimers() {
		if (this.progressInterval) clearInterval(this.progressInterval);
		if (this.navigationTimer) clearTimeout(this.navigationTimer);
		if (this.revealTimer) clearTimeout(this.revealTimer);
		this.progressInterval = null;
		this.navigationTimer = null;
		this.revealTimer = null;
	}

	start(targetUrl: '/home' = '/home') {
		if (this.isActive) return;
		this.clearTimers();

		this.isActive = true;
		this.stage = 'charging';
		this.progress = 0;

		const startTime = performance.now();
		const coverDuration = 520;
		this.progressInterval = setInterval(() => {
			this.progress = Math.min(100, ((performance.now() - startTime) / coverDuration) * 100);
			if (this.progress >= 100 && this.progressInterval) {
				clearInterval(this.progressInterval);
				this.progressInterval = null;
			}
		}, 16);

		this.navigationTimer = setTimeout(() => {
			void this.navigate(targetUrl);
		}, 420);
	}

	private async navigate(targetUrl: '/home') {
		this.navigationTimer = null;
		try {
			await goto(resolve(targetUrl));
		} catch (error) {
			console.error('Could not complete page transition:', error);
		} finally {
			if (!this.isActive) return;
			this.stage = 'revealing';
			this.revealTimer = setTimeout(() => {
				this.isActive = false;
				this.stage = 'idle';
				this.progress = 0;
				this.clearTimers();
			}, 900);
		}
	}
}

export const portalTransition = new PortalTransitionManager();
