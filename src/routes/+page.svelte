<script lang="ts">
	import { getAuth } from 'firebase/auth';
	import { onMount } from 'svelte';

	export let data;

	onMount(async () => {
		const token = await getAuth().currentUser?.getIdToken(true);
	});
</script>

<h1>Num of users: {data.count}</h1>
