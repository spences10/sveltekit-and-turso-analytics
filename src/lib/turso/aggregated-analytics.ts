import { turso_client } from './client';

export const get_aggregated_analytics = async (
	aggregation_type: 'daily' | 'weekly' | 'monthly' | 'yearly',
) => {
	const client = turso_client();
	const group_by_clause = {
		daily: 'DATE(page_visits.created_at)',
		weekly: "STRFTIME('%Y-%W', page_visits.created_at)",
		monthly: "STRFTIME('%Y-%m', page_visits.created_at)",
		yearly: "STRFTIME('%Y', page_visits.created_at)",
	}[aggregation_type];

	// Additional WHERE clause for daily aggregation
	const where_clause =
		aggregation_type === 'daily'
			? "WHERE DATE(page_visits.created_at) = DATE('now')"
			: '';

	const sql = `
		SELECT
			${group_by_clause} as period,
			slug,
			COUNT(*) as pageviews,
			COUNT(DISTINCT session_id) as uniques,
			AVG(user_session.session_duration) as avg_duration,
			(CAST(SUM(CASE WHEN user_session.page_count = 1 THEN 1 ELSE 0 END) AS REAL) / COUNT(*)) * 100 as bounce_rate
		FROM
			page_visits
		INNER JOIN
			user_session ON page_visits.session_id = user_session.id
		${where_clause}
		GROUP BY
			${group_by_clause}, slug;
	`;

	const result = await client.execute(sql);
	return result.rows;
};
