<script lang="ts">
	import { goto } from '$app/navigation';
	import Book from '$lib/components/Books/Book.svelte';
	import messagesStore from '$lib/stores/messages.store.js';

	export let data;

	const back = async () => {
		try {
			await goto(`/?page=${+data.page - 1}`);
		} catch (e) {
			messagesStore.showError();
		}
	};

	const next = async () => {
		try {
			await goto(`/?page=${+data.page + 1}`);
		} catch (e) {
			messagesStore.showError();
		}
	};
</script>

<div class="row">
	<div class="col">
		<h1>Latest Books</h1>
		<h3>Page: {data.page}</h3>
	</div>
</div>

{#each data.books as book (book.id)}
	<Book {book} />
{/each}

<div class="row">
	<div class="col">
		<button on:click={back} disabled={!data.previous} class="btn btn-info w-100">Previous</button>
	</div>
	<div class="col">
		<button on:click={next} disabled={!data.next} class="btn btn-info w-100">Next</button>
	</div>
</div>
