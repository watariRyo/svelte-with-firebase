<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import LoginWithGoogle from '$lib/components/Auth/LoginWithGoogle.svelte';
	import { registerWithEmailAndPassword } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';

	// TODO: Event型のanyのFix
	const register = async (e: any) => {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email')?.toString() || '';
			const password = formData.get('password')?.toString() || '';
			if (email === '' || password === '') {
				messagesStore.showError('Please enter a valid email and password.');
				return;
			}
			if (password.length < 6) {
				messagesStore.showError('Password must be at least 6 characters.');
				return;
			}
			const user = await registerWithEmailAndPassword(email, password);
			messagesStore.hide();
		} catch (error: any) {
			if (error.code === 'auth/email-already-in-use') {
				messagesStore.showError('You have already registered, please log in.');
				await goto('/login');
			} else {
				console.log(error);
				messagesStore.showError();
			}
		}
	};
</script>

<div class="row">
	<div class="col">
		<h1>Sign Up</h1>
	</div>
</div>
<hr />
<AuthForm on:submit={register} btnName="Sign Up" />
<hr />
<LoginWithGoogle />

<svelte:head>
	<title>Book Lovers - Sign Up</title>
</svelte:head>
