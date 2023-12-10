<script lang="ts">
	type SessionDataItem = {
		date: string;
		total_sessions: number;
		avg_duration: number;
		total_page_views: number;
	};

	type PageData = {
		session_data: SessionDataItem[];
	};
	let { data } = $props() as { data: PageData };
</script>

<div class="prose prose-xl mb-20 prose-headings:text-accent">
	<h1>Session data</h1>

	<p>
		Session data stored for no longer than 24 hours and deleted after
		the session ends.
	</p>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Date</th>
				<th>Total Sessions</th>
				<th>Avg Duration</th>
				<th>Total Pageviews</th>
			</tr>
		</thead>
		<tbody>
			{#each data.session_data as session}
				<tr class="hover">
					<td>{session.date}</td>
					<td>{session.total_sessions}</td>
					<td>{session.avg_duration.toFixed(2)}</td>
					<td>{session.total_page_views}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
