import type { Config } from '@sveltejs/kit';

export const config: Config = { runtime: 'nodejs18.x' };

export const load = async ({ fetch }) => {
	let session_data = {};
	try {
		// Fetch data from the aggregated sessions endpoint
		const response = await fetch('/aggregated-sessions');
		if (!response.ok) {
			throw new Error('Failed to fetch session data');
		}

		session_data = await response.json();
	} catch (error) {
		session_data = { error: error };
	}

	return {
		session_data,
	};
};
