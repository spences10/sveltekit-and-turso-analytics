import { get_daily_aggregated_sessions } from '$lib/turso';
import { json, type Config } from '@sveltejs/kit';

export const config: Config = { runtime: 'nodejs18.x' };

export const GET = async () => {
	try {
		const session_data = await get_daily_aggregated_sessions();
		return json(session_data);
	} catch (error) {
		return json({ error: error }, { status: 500 });
	}
};
