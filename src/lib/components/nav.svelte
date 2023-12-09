<script lang="ts">
	let links = [
		{ href: `/`, title: `Home` },
		{ href: `/about`, title: `About` },
		{ href: `/page-views`, title: `Page Views` },
		{ href: `/locations`, title: `Locations` },
		{ href: `/sessions`, title: `Session Data` },
	];
</script>

<header
	class="sticky top-0 z-10 backdrop-filter bg-base-100/50 backdrop-blur-xl px-4 lg:px-6 h-14 flex items-center mb-20"
>
	<a class="flex items-center justify-center" href="/">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-6 w-6"
		>
			<path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
		</svg>
		<span class="sr-only">Turso Analytics</span>
	</a>
	<nav class="ml-auto flex gap-4 sm:gap-6">
		{#each links as { href, title }}
			<a class="link link-primary" {href}>
				{title}
			</a>
		{/each}
	</nav>
</header>
