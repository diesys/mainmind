<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: favicon is used in the <svelte:head> block
import favicon from '$lib/assets/favicon.svg';

// biome-ignore lint/correctness/noUnusedVariables: children is rendered via {@render children()}
let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
