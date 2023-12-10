import type { Config } from '@sveltejs/kit';

export const config: Config = { runtime: 'nodejs18.x' };

type LocationDataType = {
	[key: string]: any;
};

export const load = async ({ fetch }) => {
	const aggregation_types = [
		'city',
		'region',
		'country',
		'timezone',
		'location',
	];
	const location_data: LocationDataType = {};

	for (const type of aggregation_types) {
		try {
			const response = await fetch(
				`/aggregated-locations?type=${type}`,
			);
			if (!response.ok) {
				throw new Error('Failed to fetch location data');
			}
			location_data[type] = await response.json();
		} catch (error) {
			location_data[type] = { error: error };
		}
	}

	return {
		locations: location_data,
	};
};
