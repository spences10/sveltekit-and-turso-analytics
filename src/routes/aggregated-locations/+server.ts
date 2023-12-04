import { get_aggregated_locations } from '$lib/turso/aggregated-locations';
import { json, type Config } from '@sveltejs/kit';

export const config: Config = { runtime: 'nodejs18.x' };

export const GET = async ({ url }) => {
	const aggregation_type =
		(url.searchParams.get('type') as 'city' | 'region' | 'country') ||
		'city';

	try {
		const location_data =
			await get_aggregated_locations(aggregation_type);
		return json(location_data);
	} catch (error) {
		console.error('Error in aggregated locations endpoint: ', error);
		return json({ error: error }, { status: 500 });
	}
};
