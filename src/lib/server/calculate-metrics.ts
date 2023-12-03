import { turso_client } from '$lib/turso';

export const calculate_metrics = async () => {
	const client = turso_client();

	// SQL to calculate average session duration for each page
	let avg_duration_sql = `
    UPDATE page_analytics
    SET avg_duration = (
      SELECT AVG(session_duration)
      FROM user_session
      WHERE user_session.id IN (
        SELECT session_id
        FROM page_visits
        WHERE page_visits.slug = page_analytics.slug
      )
    )
  `;
	await client.execute(avg_duration_sql);

	// SQL to calculate bounce rate for each page
	let bounce_rate_sql = `
    UPDATE page_analytics
    SET bounce_rate = (
      SELECT CAST(COUNT(*) AS REAL) / (
        SELECT COUNT(*)
        FROM user_session
        WHERE user_session.id IN (
          SELECT session_id
          FROM page_visits
          WHERE page_visits.slug = page_analytics.slug
        )
      )
      FROM user_session
      WHERE page_count = 1
      AND user_session.id IN (
        SELECT session_id
        FROM page_visits
        WHERE page_visits.slug = page_analytics.slug
      )
    )
  `;
	await client.execute(bounce_rate_sql);

	// Cleanup old session data
	let cleanup_sql = `
    DELETE FROM user_session 
    WHERE 
      (session_end IS NOT NULL AND session_end < datetime('now', '-1 hour')) OR
      (session_end IS NULL AND session_start < datetime('now', '-24 hours'))
  `;
	await client.execute(cleanup_sql);
};
