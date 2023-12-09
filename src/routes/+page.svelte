<script lang="ts">
	const items = [
		{ href: `/page-views`, title: `Page Views` },
		{ href: `/locations`, title: `Aggregated Locations` },
		{ href: `/sessions`, title: `Session Data` },
	];
</script>

<div class="prose prose-xl prose-h1:text-accent text-center">
	<h1>Turso &amp; SvelteKit Analytics Experiment</h1>
	<p class="text-base-content/70">
		An exploration on what analytics could be recorded with Turso
		and SvelteKit.
	</p>
	<p class="text-base-content/70">
		Take a look around at the various anonymised data that is recorded.
	</p>
</div>

<div class="mt-12">
	<h2 class="text-2xl font-bold mb-6">Analytics</h2>
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#snippet div({href, title})}
			<a {href} class="relative group">
				<div 
					class="absolute inset-0.5 bg-gradient-to-r from-primary to-accent rounded-box blur opacity-75 group-hover:opacity-100 group-hover:-inset-0.5"
				/>
				<div class="relative text-center bg-base-100 p-4 rounded-box">
					<h3 class="py-1 text-lg font-semibold">{title}</h3>
				</div>		
			</a>
		{/snippet}
		{#each items as {href, title}}
			{@render div({href, title})}
		{/each}
	</div>
</div>
