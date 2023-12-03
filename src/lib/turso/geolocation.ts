import { dev } from '$app/environment';
import { IPINFO_TOKEN } from '$env/static/private';
import type { InValue, Value } from '@libsql/client/http';
import { turso_client } from './client';

async function fetch_geo_location(ip_address: string) {
	const response = await fetch(
		`https://ipinfo.io/${ip_address}?token=${IPINFO_TOKEN}`,
	);
	if (!response.ok) {
		throw new Error('Failed to fetch geolocation data');
	}
	return response.json();
}

export async function handle_geolocation_data(
	request_ip: string,
	session_id: InValue,
) {
	if (!dev && request_ip) {
		const geo_data = await fetch_geo_location(request_ip);
		const client = turso_client();
		const insert_geo_data_sql = `INSERT INTO session_geolocation (session_id, city, region, country, location, timezone) VALUES (?, ?, ?, ?, ?, ?)`;
		await client.execute({
			sql: insert_geo_data_sql,
			args: [
				session_id,
				geo_data.city,
				geo_data.region,
				geo_data.country,
				geo_data.loc,
				geo_data.timezone,
			],
		});
	}
}
