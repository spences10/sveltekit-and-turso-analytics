import { turso_client } from '$lib/turso';

export const calculate_metrics = async () => {
	const client = turso_client();

	// SQL to calculate average session duration for each page
	let avg_duration_sql = `
		UPDATE page_analytics
		SET avg_duration = (
			SELECT AVG(user_session.session_duration)
			FROM user_session
			JOIN page_visits ON user_session.id = page_visits.session_id
			WHERE page_visits.slug = page_analytics.slug
			AND date(user_session.session_start) = date(page_analytics.date)
		)
		WHERE EXISTS (
			SELECT 1
			FROM user_session
			JOIN page_visits ON user_session.id = page_visits.session_id
			WHERE page_visits.slug = page_analytics.slug
			AND date(user_session.session_start) = date(page_analytics.date)
		);
	`;
	await client.execute(avg_duration_sql);

	// SQL to calculate bounce rate for each page
	let bounce_rate_sql = `
		UPDATE page_analytics
		SET bounce_rate = (
			SELECT CAST(COUNT(*) AS REAL) / (
				SELECT COUNT(*)
				FROM user_session
				JOIN page_visits ON user_session.id = page_visits.session_id
				WHERE page_visits.slug = page_analytics.slug
				AND date(user_session.session_start) = date(page_analytics.date)
			)
			FROM user_session
			JOIN page_visits ON user_session.id = page_visits.session_id
			WHERE user_session.page_count = 1
			AND page_visits.slug = page_analytics.slug
			AND date(user_session.session_start) = date(page_analytics.date)
		)
		WHERE EXISTS (
			SELECT 1
			FROM user_session
			JOIN page_visits ON user_session.id = page_visits.session_id
			WHERE page_visits.slug = page_analytics.slug
			AND date(user_session.session_start) = date(page_analytics.date)
		);
	`;
	await client.execute(bounce_rate_sql);

	// Cleanup old session data
	let cleanup_sql = `
		DELETE FROM user_session 
		WHERE 
			(session_end IS NOT NULL AND session_end < datetime('now', '-1 hour')) OR
			(session_end IS NULL AND session_start < datetime('now', '-24 hours'));
	`;
	await client.execute(cleanup_sql);
};
