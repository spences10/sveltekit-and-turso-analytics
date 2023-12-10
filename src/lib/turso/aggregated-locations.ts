import { turso_client } from './client';

export const get_aggregated_locations = async (
	aggregation_type:
		| 'city'
		| 'region'
		| 'country'
		| 'timezone'
		| 'location',
) => {
	const client = turso_client();

	const group_by_mappings = {
		city: 'city',
		region: 'region',
		country: 'country',
		timezone: 'timezone',
		location: 'location',
	};

	const group_by_clause =
		group_by_mappings[aggregation_type] || 'city';

	const sql = `
		SELECT
			${group_by_clause},
			COUNT(*) as session_count
		FROM
			session_geolocation
		GROUP BY
			${group_by_clause};
		`;

	const result = await client.execute(sql);
	return result.rows;
};
