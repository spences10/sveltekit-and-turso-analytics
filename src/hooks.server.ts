import {
	create_or_update_session,
	handle_geolocation_data,
	update_page_visit,
} from '$lib/turso';
import type { Config, Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const config: Config = { runtime: 'nodejs18.x' };

export const user_session: Handle = async ({ event, resolve }) => {
	try {
		const user_agent = event.request.headers.get('user-agent');
		const referrer = event.request.headers.get('referer');
		const request_ip = event.getClientAddress();
		event.locals.user_ip = request_ip;

		const session_id = await create_or_update_session(
			request_ip,
			user_agent,
			referrer,
		);

		if (session_id !== null) {
			await handle_geolocation_data(request_ip, session_id);
			const page_slug = event.url.pathname;
			await update_page_visit(page_slug, session_id);

			// Set session cookie
			const session_data = {
				session_id: session_id.toString(), // Convert BigInt to string
				user_agent,
				referrer,
			};
			event.cookies.set(
				'session-data',
				JSON.stringify(session_data),
				{
					path: '/',
					httpOnly: false, // Set to false to access it via JavaScript
					maxAge: 3600, // Expires in 1 hour
				},
			);
		} else {
			console.error('Session creation failed');
		}
	} catch (error) {
		console.error('Error in user_session handle: ', error);
	}
	return resolve(event);
};

export const handle = sequence(user_session);
