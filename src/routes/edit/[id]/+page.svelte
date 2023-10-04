<script lang="ts">
	import BookEditForm from '$lib/components/Books/BookEditForm.svelte';

	export let data;
	export let form;
</script>

<BookEditForm form={{ ...data, form }} />
