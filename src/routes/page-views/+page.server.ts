type AnalyticsDataType = {
	[key: string]: any;
};

export const load = async ({ fetch }) => {
	const aggregation_types = ['daily', 'weekly', 'monthly', 'yearly'];
	const analytics_data: AnalyticsDataType = {};

	for (const type of aggregation_types) {
		try {
			const response = await fetch(
				`/aggregated-analytics?type=${type}`,
			);
			if (!response.ok) {
				throw new Error('Failed to fetch analytics data');
			}
			analytics_data[type] = await response.json();
		} catch (error) {
			analytics_data[type] = { error: error };
		}
	}

	return {
		analytics: analytics_data,
	};
};
