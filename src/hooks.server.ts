import { calculate_metrics } from '$lib/server';
import { update_page_visit } from '$lib/server/update-page-visit';
import { turso_client } from '$lib/turso';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

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

		console.log('IP Address from Client Request: ', request_ip);

		const page_slug = event.url.pathname;
		await update_page_visit(page_slug, session_id);
	} catch (error) {
		console.error('Error in user_session handle: ', error);
	}

	// TODO: remove this add to schedule
	calculate_metrics();

	return resolve(event);
};

export const handle = sequence(user_session);
