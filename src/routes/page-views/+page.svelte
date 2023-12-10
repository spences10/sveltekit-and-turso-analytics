<script lang="ts">
	let { data } = $props();
	let selected_period = $state('daily');
	let displayed_data: {
		period: string;
		slug: string;
		pageviews: number;
		uniques: number;
		avg_duration: number;
		bounce_rate: number;
	}[] = $state([]);

	$effect(() => {
		displayed_data =
			data.analytics?.[selected_period]?.map(
				(item: { avg_duration: number; bounce_rate: number }) => ({
					...item,
					avg_duration: item.avg_duration
						? parseFloat(item.avg_duration.toFixed(2))
						: null,
					bounce_rate: item.bounce_rate
						? parseFloat(item.bounce_rate.toFixed(2))
						: null,
				}),
			) ?? [];
	});
</script>

<div class="prose prose-xl mb-20 prose-headings:text-accent">
	<h1>Page views</h1>

	<p>This takes unique session IDs and groups them by page slug.</p>
</div>

<select
	bind:value={selected_period}
	class="select select-accent select-sm mb-5"
>
	<option value="daily">Daily</option>
	<option value="weekly">Weekly</option>
	<option value="monthly">Monthly</option>
	<option value="yearly">Yearly</option>
</select>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Period</th>
				<th>Page</th>
				<th>Pageviews</th>
				<th>Uniques</th>
				<th>Avg Duration</th>
				<th>Bounce Rate</th>
			</tr>
		</thead>
		<tbody>
			{#each displayed_data as row}
				<tr class="hover">
					<td>{row.period}</td>
					<td>{row.slug}</td>
					<td>{row.pageviews}</td>
					<td>{row.uniques}</td>
					<td>{row.avg_duration}</td>
					<td>{row.bounce_rate ? `${row.bounce_rate}%` : ``}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
