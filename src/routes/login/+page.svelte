<script lang="ts">
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import LoginWithGoogle from '$lib/components/Auth/LoginWithGoogle.svelte';
	import { loginWithEmailAndPassowrd } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';

	const onLogin = async (e: any) => {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email')?.toString() || '';
			const password = formData.get('password')?.toString() || '';
			if (email === '' || password === '') {
				messagesStore.showError('Please enter a valid email and password.');
				return;
			}
			const user = await loginWithEmailAndPassowrd(email, password);
			messagesStore.hide();
		} catch (error: any) {
			console.log(error);
			messagesStore.showError('Email or password is incorrect.');
		}
	};
</script>

<div class="row">
	<div class="col">
		<h1>Login</h1>
	</div>
</div>
<AuthForm on:submit={onLogin} btnName="Login" />
<hr />
<LoginWithGoogle />
<hr />
<div class="row">
	<div class="col">
		<a href="/forgot-password" class="btn btn-warning w-100">Forgot Password</a>
	</div>
</div>

<svelte:head>
	<title>Book Lovers - Login</title>
</svelte:head>
