<script lang="ts">
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import { mailResetpasswordEmail } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';

	let hideForm = false;
	const onForgotPassword = async (e: any) => {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email')?.toString() || '';
			if (email === '') {
				messagesStore.showError('Please enter a valid email');
				return;
			}
			await mailResetpasswordEmail(email);
			hideForm = true;
			messagesStore.showSuccess('Reset password email sent.');
		} catch (error: any) {
			if (error.code === 'auth/invalid-email') {
				messagesStore.showError('Email not found, please try again.');
				return;
			}
			console.log(error.code);
			messagesStore.showError();
		}
	};
</script>

<div class="row">
	<div class="col">
		<h1>Forgot Password</h1>
	</div>
</div>

{#if !hideForm}
	<AuthForm on:submit={onForgotPassword} forgotPassword={true} btnName="Forgot Password" />
{/if}

<svelte:head>
	<title>Book Lovers - Forgot Password</title>
</svelte:head>
