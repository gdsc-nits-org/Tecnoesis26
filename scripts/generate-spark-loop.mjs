import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const outputPath = resolve('static/videos/spark-night-background.webm');
const ffmpegPath = join(process.env.LOCALAPPDATA, 'ms-playwright', 'ffmpeg-1011', 'ffmpeg-win64.exe');
const browser = await chromium.launch({ headless: true });

try {
	const page = await browser.newPage();
	await page.setViewportSize({ width: 960, height: 540 });
	await page.setContent(`
		<canvas id="stage" width="960" height="540"></canvas>
		<script>
			const canvas = document.querySelector('#stage');
			const context = canvas.getContext('2d');
			window.renderSparkFrame = (progress) => {
				const phase = progress * Math.PI * 2;
				const width = canvas.width;
				const height = canvas.height;
				const background = context.createLinearGradient(0, 0, width, height);
				background.addColorStop(0, '#090615');
				background.addColorStop(0.5, '#1b0827');
				background.addColorStop(1, '#07151d');
				context.fillStyle = background;
				context.fillRect(0, 0, width, height);

				for (const [index, color] of ['#ff45ad', '#55dcf4', '#8b58ff'].entries()) {
					const x = width * (0.5 + Math.sin(phase + index * 2.1) * 0.32);
					const y = height * (0.48 + Math.cos(phase + index * 1.8) * 0.18);
					const glow = context.createRadialGradient(x, y, 0, x, y, 300);
					glow.addColorStop(0, color + '3d');
					glow.addColorStop(1, color + '00');
					context.fillStyle = glow;
					context.fillRect(0, 0, width, height);
				}

				context.save();
				context.translate(width / 2, height * 0.78);
				context.rotate(Math.sin(phase) * 0.06);
				for (let index = 0; index < 5; index += 1) {
					context.beginPath();
					context.ellipse(0, 0, 120 + index * 72, 28 + index * 24, 0, Math.PI, Math.PI * 2);
					context.strokeStyle = 'rgba(' + (index % 2 ? '92, 225, 245' : '255, 95, 195') + ', ' + (0.34 - index * 0.045) + ')';
					context.lineWidth = index === 0 ? 2 : 1;
					context.stroke();
				}
				context.restore();

				for (let index = 0; index < 9; index += 1) {
					const x = width * (index + 0.5) / 9;
					const sway = Math.sin(phase + index * 0.7) * 0.045;
					const gradient = context.createLinearGradient(x, 0, x + sway * width, height * 0.82);
					gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
					gradient.addColorStop(0.48, index % 2 ? 'rgba(117, 230, 244, 0.055)' : 'rgba(255, 115, 190, 0.07)');
					gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
					context.beginPath();
					context.moveTo(x - 8, 0);
					context.lineTo(x + 8, 0);
					context.lineTo(x + sway * width + 38, height);
					context.lineTo(x + sway * width - 38, height);
					context.closePath();
					context.fillStyle = gradient;
					context.fill();
				}

				for (let index = 0; index < 44; index += 1) {
					const x = ((index * 157 + Math.sin(phase + index) * 15) % width + width) % width;
					const y = (index * 83) % height;
					const shimmer = 0.24 + (Math.sin(phase * 2 + index) + 1) * 0.25;
					context.fillStyle = 'rgba(210, 245, 255, ' + shimmer + ')';
					context.fillRect(x, y, 2, 2);
				}

			};
		</script>
	`);

	const frameCount = 192;
	const frames = [];
	for (let index = 0; index < frameCount; index += 1) {
		await page.evaluate((progress) => window.renderSparkFrame(progress), index / frameCount);
		frames.push(await page.screenshot({ type: 'jpeg', quality: 82 }));
	}

	await mkdir(resolve('static/videos'), { recursive: true });
	const result = spawnSync(
		ffmpegPath,
		[
			'-y',
			'-v',
			'error',
			'-framerate',
			'24',
			'-vcodec',
			'mjpeg',
			'-f',
			'image2pipe',
			'-i',
			'pipe:0',
			'-c:v',
			'libvpx',
			'-deadline',
			'realtime',
			'-cpu-used',
			'5',
			'-b:v',
			'360k',
			'-crf',
			'34',
			'-pix_fmt',
			'yuv420p',
			'-an',
			'-f',
			'webm',
			outputPath
		],
		{ encoding: 'utf8', input: Buffer.concat(frames) }
	);
	if (result.status !== 0) throw new Error(result.stderr || 'FFmpeg failed to encode the video.');
	const { size } = await import('node:fs/promises').then(({ stat }) => stat(outputPath));
	if (size > 2 * 1024 * 1024) throw new Error(`Generated video is over 2 MB: ${size} bytes`);
	console.log(`Generated ${outputPath} (${(size / 1024).toFixed(1)} KB)`);
} finally {
	await browser.close();
}