import { describe, expect, it } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// SvelteKit refuses to dispatch a POST when a route exports a `default` action
// alongside named ones ("When using named actions, the default action cannot be
// used"), and it rejects `?/default` as a reserved action name. Both throw at
// request time, not at build or type-check time, so a route can look perfectly
// healthy in unit tests that call the action functions directly and still 500 in
// the browser. /login shipped with both faults at once. These tests walk the real
// route tree so the next one is caught here instead of in production.

const routesDir = join(process.cwd(), 'src', 'routes');

function walk(dir: string, matcher: (name: string) => boolean): string[] {
	const found: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			found.push(...walk(full, matcher));
		} else if (matcher(entry)) {
			found.push(full);
		}
	}
	return found;
}

const serverFiles = walk(routesDir, (name) => name === '+page.server.ts');
const svelteFiles = walk(routesDir, (name) => name.endsWith('.svelte'));

const rel = (file: string) => relative(routesDir, file).split(sep).join('/');

describe('form action wiring', () => {
	it('finds route files to inspect', () => {
		expect(serverFiles.length).toBeGreaterThan(0);
		expect(svelteFiles.length).toBeGreaterThan(0);
	});

	it.each(serverFiles.map((file) => [rel(file), file]))(
		'%s does not mix a default action with named actions',
		async (_name, file) => {
			const module = (await import(/* @vite-ignore */ file)) as {
				actions?: Record<string, unknown>;
			};
			const actions = module.actions;
			if (!actions) {
				expect(actions).toBeUndefined();
				return;
			}
			const names = Object.keys(actions);
			// Mirrors SvelteKit's own check_named_default_separate guard.
			expect(
				names.includes('default') && names.length > 1,
				`${_name} exports actions [${names.join(', ')}]. SvelteKit throws on every POST to this route.`
			).toBe(false);
		}
	);

	it.each(svelteFiles.map((file) => [rel(file), file]))(
		'%s never targets the reserved ?/default action',
		async (_name, file) => {
			const { readFileSync } = await import('node:fs');
			const source = readFileSync(file, 'utf8');
			expect(
				source.includes('?/default'),
				`${_name} posts to "?/default", which SvelteKit rejects as a reserved action name.`
			).toBe(false);
		}
	);
});
