<script lang="ts">
	export let data;

	const books = data.books;
</script>

<ul>
	{#each books as book (book.id)}
		<li>{book.title}</li>
	{/each}
</ul>
