import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

type ServerFetch = typeof fetch;

export async function fetchBackend(fetch: ServerFetch, path: string): Promise<unknown> {
	if (!env.BACKEND_API_URL) {
		throw error(500, 'The backend API URL is not configured.');
	}

	const response = await fetch(new URL(path, `${env.BACKEND_API_URL.replace(/\/$/, '')}/`), {
		headers: { accept: 'application/json' }
	});

	if (!response.ok) {
		throw error(response.status, 'The backend API request failed.');
	}

	return response.json();
}
