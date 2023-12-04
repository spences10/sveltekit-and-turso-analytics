<script lang="ts">
	import { Header } from '$lib/components';
	import '../app.pcss';
</script>

<div class="flex flex-col min-h-screen">
	<Header />
	<slot />
</div>
