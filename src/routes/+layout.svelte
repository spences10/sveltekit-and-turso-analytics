<script lang="ts">
	import { Footer, Nav } from '$lib/components';
	import '../app.postcss';
</script>

<Nav />

<div class="flex flex-col min-h-screen overflow-x-hidden">
	<main class="container max-w-3xl mx-auto px-4 flex-grow">
		<slot />
	</main>

	<Footer />
</div>
