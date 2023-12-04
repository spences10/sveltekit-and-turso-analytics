<script lang="ts">
	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Features', href: '/features' },
		{ name: 'About', href: '/about' },
		{ name: 'Contact', href: '/contact' },
	];
</script>

<header class="px-4 lg:px-6 h-16 flex items-center">
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
		{#each links as { href, name }}
			<a
				class="text-sm font-medium hover:underline underline-offset-4"
				{href}
			>
				{name}
			</a>
		{/each}
	</nav>
</header>
