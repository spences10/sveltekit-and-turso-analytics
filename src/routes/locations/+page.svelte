<script lang="ts">
	type RowType = {
		city?: string;
		region?: string;
		country?: string;
		session_count: number;
	};
	type KeyType = keyof RowType;

	let { data } = $props();
	let selected_type = $state<KeyType>('city');
	let displayed_data: Array<{
		city?: string;
		region?: string;
		country?: string;
		session_count: number;
	}> = $state([]);

	$effect(() => {
		displayed_data = data.locations?.[selected_type] ?? [];
	});
</script>

<div class="prose prose-xl mb-20 prose-headings:text-accent">
	<h1>Locations</h1>

	<p>
		<a href="https://ipinfo.io" >ipinfo.io</a> is used to get the location
		data from the IP address of each session.
	</p>
</div>

<select
	bind:value={selected_type}
	class="select select-accent select-sm mb-5"
>
	<option value="city">City</option>
	<option value="region">Region</option>
	<option value="country">Country</option>
	<option value="timezone">Timezone</option>
	<option value="location">Location</option>
</select>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>
					{selected_type.charAt(0).toUpperCase() +
						selected_type.slice(1)}
				</th>
				<th>Session Count</th>
			</tr>
		</thead>
		<tbody>
			{#each displayed_data as row}
				<tr class="hover">
					<td>{row[selected_type]}</td>
					<td>{row.session_count}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
