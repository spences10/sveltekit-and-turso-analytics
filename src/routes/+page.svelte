<script lang="ts">
	const items = [`Page Views`, `Aggregated Locations`, `Bounce Rate`];
</script>

<div class="flex flex-col items-center space-y-4 text-center">
	<div class="space-y-2 mb-7">
		<h1
			class="mb-4 text-3xl font-bold tracking-wide sm:text-4xl md:text-5xl lg:text-6xl/none"
		>
			Turso &amp; SvelteKit Analytics Experiment
		</h1>
		<p class="mx-auto md:text-xl text-base-content/70">
			An exploration on what analytics could be recorded with Turso
			and SvelteKit.
		</p>
	</div>
	<div class="space-x-4">
		<a class="btn btn-primary rounded-box shadow-xl" href="/">
			Check Out the Things
		</a>
	</div>
</div>
<div class="mt-12">
	<h2 class="text-2xl font-bold mb-6">Analytics</h2>
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#snippet div(item)}
			<div class="relative group cursor-pointer">
				<div 
					class="absolute inset-0.5 bg-gradient-to-r from-primary to-accent rounded-box blur opacity-75 group-hover:opacity-100 group-hover:-inset-1"
				/>
				<div class="relative bg-base-100 p-4 rounded-box shadow-sm">
					<h3 class="text-lg font-semibold mb-2">{item}</h3>
				</div>		
			</div>
		{/snippet}
		{#each items as item}
			{@render div(item)}
		{/each}
	</div>
</div>
