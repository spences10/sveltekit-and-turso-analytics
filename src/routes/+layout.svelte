<script lang="ts">
	import { Footer, Nav } from '$lib/components';
	import '../app.postcss';
</script>

<svelte:head>
	<title>Turso & SvelteKit Analytics</title>
	<meta name="description" content="Analytics" />
	<meta name="robots" content="noindex" />
</svelte:head>

<Nav />

<div class="flex min-h-screen flex-col overflow-x-hidden">
	<main class="container mx-auto max-w-3xl flex-grow px-4">
		<slot />
	</main>

	<Footer />
</div>
