<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const response = await fetch('/like/XoJb03EdrpsdvaRAzE3l');
		const json = await response.json();
	});
</script>
