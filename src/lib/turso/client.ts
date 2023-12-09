import {
	TURSO_DB_AUTH_TOKEN,
	TURSO_DB_URL,
} from '$env/static/private';
import { createClient, type Client } from '@libsql/client';

let client_instance: Client | null = null;

export const turso_client = (): Client => {
	if (!client_instance) {
		const url = TURSO_DB_URL?.trim();
		if (url === undefined) {
			throw new Error('TURSO_DB_URL is not defined');
		}

		const auth_token = TURSO_DB_AUTH_TOKEN?.trim();
		if (auth_token === undefined) {
			if (!url.includes('file:')) {
				throw new Error('TURSO_DB_AUTH_TOKEN is not defined');
			}
		}

		client_instance = createClient({
			url: TURSO_DB_URL as string,
			authToken: TURSO_DB_AUTH_TOKEN as string,
		});
	}
	return client_instance;
};
