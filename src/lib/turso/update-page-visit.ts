import { turso_client } from '$lib/turso';
import type { Value } from '@libsql/client/http';

export const update_page_visit = async (
	slug: string,
	session_id: Value,
) => {
	const client = turso_client();
	const normalised_slug =
		slug === '/' ? '/' : slug.split('?')[0].replace(/\/$/, '');

	// Exclude specific paths or API calls
	const excluded_paths = ['/session-end'];
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

	// Insert a new visit record if it's a new visit
	if (is_new_visit) {
		let insert_visit_sql =
			'INSERT INTO page_visits (session_id, slug) VALUES (?, ?)';
		await client.execute({
			sql: insert_visit_sql,
			args: [session_id, normalised_slug],
		});
	}

	// Update the page_analytics table
	let sql = 'SELECT id FROM page_analytics WHERE slug = ?';
	const result = await client.execute({
		sql,
		args: [normalised_slug],
	});

	if (result.rows && result.rows.length > 0) {
		// Update existing record
		sql = `UPDATE page_analytics SET pageviews = pageviews + 1, visits = visits + ${
			is_new_visit ? 1 : 0
		} WHERE slug = ?`;
		await client.execute({ sql, args: [normalised_slug] });
	} else {
		// Insert new record for the slug if it doesn't exist
		sql =
			'INSERT INTO page_analytics (slug, pageviews, visits) VALUES (?, 1, 1)';
		await client.execute({ sql, args: [normalised_slug] });
	}
};
