<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Nav from '$lib/components/Nav.svelte';
	import '$lib/firebase/firebase.client';

	import messageStore from '$lib/stores/messages.store';

	const closeMessage = () => {
		messageStore.hide();
	};
</script>

<Nav />
<main class="container">
	{#if $messageStore.show}
		<div class="row mt-3">
			<div class="col">
				<div
					class:alert-danger={$messageStore.type === 'error'}
					class:alert-success={$messageStore.type === 'success'}
					class="alert alert-dismissible alert-danger"
					role="alert"
				>
					<strong>{$messageStore.type === 'error' ? 'Error' : 'Success'}</strong>
					{$messageStore.message}
					<button type="button" on:click={closeMessage} class="btn-close" aria-label="Close" />
				</div>
			</div>
		</div>
	{/if}
	<slot />
</main>
