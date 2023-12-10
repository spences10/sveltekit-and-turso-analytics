import type { InValue } from '@libsql/client/http';
import { turso_client } from '.';

export const update_page_visit = async (
	slug: string,
	session_id: InValue,
) => {
	const client = turso_client();
	const normalised_slug =
		slug === '/' ? '/' : slug.split('?')[0].replace(/\/$/, '');

	// Exclude specific paths or API calls
	const excluded_paths = [
		'/session-end',
		'/aggregated-analytics',
		'/aggregated-locations',
		'/aggregated-sessions',
	];
	if (
		excluded_paths.some((path) => normalised_slug.startsWith(path))
	) {
		return;
	}

	// Check if this session has already visited this slug
	let check_visit_sql =
		'SELECT id FROM page_visits WHERE session_id = ? AND slug = ?';
	const visit_result = await client.execute({
		sql: check_visit_sql,
		args: [session_id, normalised_slug],
	});
	let is_new_visit = visit_result.rows.length === 0;

	// Check for unique visit within the last 24 hours
	let check_unique_visit_sql = `
		SELECT id FROM page_visits 
		WHERE slug = ? 
		AND session_id = ? 
		AND created_at > datetime('now', '-24 hours')`;
	const unique_visit_result = await client.execute({
		sql: check_unique_visit_sql,
		args: [normalised_slug, session_id],
	});
	let is_unique_visit = unique_visit_result.rows.length === 0;

	// Insert a new visit record if it's a new visit
	if (is_new_visit) {
		let insert_visit_sql =
			'INSERT INTO page_visits (session_id, slug, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)';
		await client.execute({
			sql: insert_visit_sql,
			args: [session_id, normalised_slug],
		});
	}

	// Update the page_analytics table
	let sql =
		'SELECT id, date FROM page_analytics WHERE slug = ? ORDER BY date DESC LIMIT 1';
	const result = await client.execute({
		sql,
		args: [normalised_slug],
	});

	const current_date = new Date().toISOString().split('T')[0];

	if (
		result.rows &&
		result.rows.length > 0 &&
		result.rows[0].date === current_date
	) {
		// Update existing record for today
		sql = `UPDATE page_analytics SET 
				pageviews = pageviews + 1, 
				visits = visits + ${is_new_visit ? 1 : 0}, 
				uniques = uniques + ${is_unique_visit ? 1 : 0} 
				WHERE slug = ? AND date = ?`;
		await client.execute({
			sql,
			args: [normalised_slug, current_date],
		});
	} else {
		// Insert new record for the slug for today
		sql =
			'INSERT INTO page_analytics (date, slug, pageviews, visits, uniques) VALUES (?, ?, 1, 1, 1)';
		await client.execute({
			sql,
			args: [current_date, normalised_slug],
		});
	}
};
