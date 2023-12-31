import { calculate_metrics, turso_client } from '$lib/turso';
import {
	json,
	type Config,
	type RequestHandler,
} from '@sveltejs/kit';

export const config: Config = { runtime: 'nodejs18.x' };

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const client = turso_client();

	const session_id = data.session_id;

	// Update the user_session table to mark the session as ended
	const sql = `
		UPDATE user_session
		SET session_end = CURRENT_TIMESTAMP,
			session_duration = strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', session_start)
		WHERE id = ?
	`;
	await client.execute({
		sql,
		args: [session_id],
	});

	// trigger metric calculations
	calculate_metrics();

	return json({
		status: 200,
		body: { message: 'Session data received' },
	});
};
