import { turso_client } from '$lib/turso';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const user_session: Handle = async ({ event, resolve }) => {
	try {
		const request_ip = event.getClientAddress();
		event.locals.user_ip = request_ip;

		const client = turso_client();

		// Check for existing session
		let sql = `SELECT id FROM user_session WHERE ip_address = ? AND session_end IS NULL LIMIT 1`;
		let result = await client.execute({ sql, args: [request_ip] });

		if (result.rows && result.rows.length > 0) {
			// Update existing session
			sql = `UPDATE user_session
             SET session_end = CURRENT_TIMESTAMP,
                 session_duration = strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', session_start)
             WHERE id = ?`;
			await client.execute({
				sql,
				args: [result.rows[0].id]
			});
		} else {
			// Insert new session
			sql = `INSERT INTO user_session (ip_address, session_start) VALUES (?, CURRENT_TIMESTAMP)`;
			await client.execute({
				sql,
				args: [request_ip]
			});
		}

		console.log('IP Address from Client Request: ', request_ip);
	} catch (error) {
		console.log('Error: ', error);
	}
	return resolve(event);
};

export const handle = sequence(user_session);
