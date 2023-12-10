import { turso_client } from './client';

export const get_daily_aggregated_sessions = async () => {
	const client = turso_client();

	const sql = `
		SELECT
			DATE(session_start) as date,
			COUNT(*) as total_sessions,
			AVG(session_duration) as avg_duration,
			SUM(page_count) as total_page_views
		FROM
			user_session
		WHERE
			DATE(session_start) = DATE('now')
		GROUP BY
			DATE(session_start);
		`;

	const result = await client.execute(sql);
	return result.rows;
};
