<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Nav from '$lib/components/Nav.svelte';
	import '$lib/firebase/firebase.client';

	import messageStore from '$lib/stores/messages.store';
	import { onMount } from 'svelte';
	import { sendJWTToken } from '$lib/firebase/auth.client';
	import authStore from '$lib/stores/auth.store.js';

	export let data;

	let isLoggedIn = data.isLoggedIn;

	$: isLoggedIn = $authStore.isActive ? $authStore.isLoggedIn : data.isLoggedIn;

	let timerId: string | number | NodeJS.Timeout | undefined;

	const sendServerToken = async () => {
		try {
			await sendJWTToken();
		} catch (e) {
			clearInterval(timerId);
			messageStore.showError();
			console.log(e);
		}
	};

	onMount(async () => {
		try {
			await sendServerToken();
			timerId = setInterval(async () => {
				await sendServerToken();
			}, 1000 * 10 * 60);
		} catch (e) {
			console.log(e);
			messageStore.showError();
		}
	});

	const closeMessage = () => {
		messageStore.hide();
	};
</script>

<Nav {isLoggedIn} />
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
