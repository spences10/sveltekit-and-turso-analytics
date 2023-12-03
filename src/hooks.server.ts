import { dev } from '$app/environment';
import { IPINFO_TOKEN } from '$env/static/private';
import { turso_client, update_page_visit } from '$lib/turso';
import type { Config, Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const config: Config = {
	runtime: 'nodejs18.x',
};

// Add a function to fetch geolocation data
const fetch_geo_location = async (ip_address: string) => {
	const response = await fetch(
		`https://ipinfo.io/${ip_address}?token=${IPINFO_TOKEN}`,
	);
	if (!response.ok) {
		throw new Error('Failed to fetch geolocation data');
	}
	return response.json();
};

export const user_session: Handle = async ({ event, resolve }) => {
	try {
		const user_agent = event.request.headers.get('user-agent');
		const referrer = event.request.headers.get('referer');
		const request_ip = event.getClientAddress();
		event.locals.user_ip = request_ip;

		const client = turso_client();

		// Check for existing session
		let sql = `SELECT id, page_count FROM user_session WHERE ip_address = ? AND session_end IS NULL LIMIT 1`;
		let result = await client.execute({ sql, args: [request_ip] });

		let session_id;

		if (result.rows && result.rows.length > 0) {
			// Update existing session
			session_id = result.rows[0].id;
			const new_page_count =
				typeof result.rows[0].page_count === 'number'
					? result.rows[0].page_count + 1
					: 1;
			sql = `UPDATE user_session
             SET page_count = ?, session_end = CURRENT_TIMESTAMP,
                 session_duration = strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', session_start)
             WHERE id = ?`;
			await client.execute({
				sql,
				args: [new_page_count, session_id],
			});
		} else {
			// Insert new session
			sql = `INSERT INTO user_session (ip_address, user_agent, referrer, session_start, page_count) 
             VALUES (?, ?, ?, CURRENT_TIMESTAMP, 1)`;
			const insert_result = await client.execute({
				sql,
				args: [request_ip, user_agent, referrer],
			});
			session_id = insert_result.lastInsertRowid;

			// Handle potential undefined value for lastInsertRowid
			if (typeof session_id === 'undefined') {
				throw new Error('Failed to create a new session.');
			}
		}

		// Fetch and store geolocation data
		if (!dev && request_ip) {
			const geo_data = await fetch_geo_location(request_ip);
			const insert_geo_data_sql = `
				INSERT INTO
					session_geolocation (
						session_id,
						city,
						region,
						country,
						location,
						timezone
					)
				VALUES
					(?, ?, ?, ?, ?, ?)
				`;
			await client.execute({
				sql: insert_geo_data_sql,
				args: [
					session_id,
					geo_data.city,
					geo_data.region,
					geo_data.country,
					geo_data.loc,
					geo_data.timezone,
				],
			});
		}

		// Set session cookie
		const session_data = {
			session_id: session_id?.toString(), // Convert BigInt to string
			user_agent,
			referrer,
		};
		event.cookies.set('session-data', JSON.stringify(session_data), {
			path: '/',
			httpOnly: false, // Set to false to access it via JavaScript
			maxAge: 3600, // Expires in 1 hour
		});

		console.log('IP Address from Client Request: ', request_ip);

		const page_slug = event.url.pathname;
		await update_page_visit(page_slug, session_id);
	} catch (error) {
		console.error('Error in user_session handle: ', error);
	}

	return resolve(event);
};

export const handle = sequence(user_session);
