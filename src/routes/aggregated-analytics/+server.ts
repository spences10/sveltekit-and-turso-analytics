import { get_aggregated_analytics } from '$lib/turso/aggregated-analytics';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const aggregation_type =
		(url.searchParams.get('type') as
			| 'daily'
			| 'weekly'
			| 'monthly'
			| 'yearly') || 'daily';

	try {
		const analytics_data =
			await get_aggregated_analytics(aggregation_type);
		return json(analytics_data);
	} catch (error) {
		return json({ error: error }, { status: 500 });
	}
};
