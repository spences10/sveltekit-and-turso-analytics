import {
	endOfDay,
	format,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from 'date-fns';
import { turso_client } from './client';

export const get_aggregated_analytics = async (
	aggregation_type: 'daily' | 'weekly' | 'monthly' | 'yearly',
) => {
	const client = turso_client();
	const today = new Date();

	const aggregation_mappings = {
		daily: `DATE(created_at) = DATE('${format(
			today,
			'yyyy-MM-dd',
		)}')`,
		weekly: `DATE(created_at) >= DATE('${format(
			startOfWeek(today),
			'yyyy-MM-dd',
		)}') AND DATE(created_at) <= DATE('${format(
			endOfDay(today),
			'yyyy-MM-dd',
		)}')`,
		monthly: `DATE(created_at) >= DATE('${format(
			startOfMonth(today),
			'yyyy-MM-dd',
		)}') AND DATE(created_at) <= DATE('${format(
			endOfDay(today),
			'yyyy-MM-dd',
		)}')`,
		yearly: `DATE(created_at) >= DATE('${format(
			startOfYear(today),
			'yyyy-MM-dd',
		)}') AND DATE(created_at) <= DATE('${format(
			endOfDay(today),
			'yyyy-MM-dd',
		)}')`,
	};

	const dateCondition =
		aggregation_mappings[aggregation_type] ||
		aggregation_mappings['daily'];

	const sql = `
    SELECT
      '${aggregation_type}' as period,
      slug,
      COUNT(*) as pageviews,
      COUNT(DISTINCT session_id) as visits
    FROM
      page_visits
    WHERE
      ${dateCondition}
    GROUP BY
      slug;
    `;

	const result = await client.execute(sql);
	return result.rows;
};
