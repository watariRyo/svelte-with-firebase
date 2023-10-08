<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: any;
	let submitting = false;

	$: if (form && form.success === false) {
		submitting = false;
	}

	const submitForm = (e: SubmitEvent) => {
		submitting = true;
	};
</script>

<form enctype="multipart/form-data" method="POST" use:enhance on:submit={submitForm}>
	<div class="mb-3">
		<label for="title" class="form-label">Book Title</label>
		<input
			type="text"
			name="title"
			class="form-control"
			value={form?.form?.book.title || form?.book.title || ''}
			class:is-invalid={form?.form?.errors?.error_title}
			id="title"
			placeholder="Book Title"
		/>
		{#if form?.form?.errors?.error_title}
			<div class="invalid-feedback">{form?.form?.errors?.error_title}</div>
		{/if}
	</div>
	<div class="mb-3">
		<label for="author" class="form-label">Author</label>
		<input
			type="text"
			name="author"
			class="form-control"
			value={form?.form?.book.author || form?.book.author || ''}
			class:is-invalid={form?.form?.errors?.error_author}
			id="author"
			placeholder="Author"
		/>
		{#if form?.form?.errors?.error_author}
			<div class="invalid-feedback">{form?.form?.errors?.error_author}</div>
		{/if}
	</div>
	<div class="mb-3">
		<label for="short_description" class="form-label">Short Description</label>
		<input
			type="text"
			name="short_description"
			class="form-control"
			value={form?.form?.book.short_description || form?.book.short_description || ''}
			class:is-invalid={form?.form?.errors?.error_short_description}
			id="short_description"
			placeholder="Enter short description"
		/>
		{#if form?.form?.errors?.error_short_description}
			<div class="invalid-feedback">{form?.form?.errors?.error_short_description}</div>
		{/if}
	</div>
	<div class="mb-3">
		<label class="form-label" for="description">Description</label>
		<textarea
			class="form-control"
			placeholder="Book Description here"
			value={form?.form?.book.description || form?.book.description || ''}
			class:is-invalid={form?.form?.errors?.error_description}
			id="description"
			name="description"
			style="height: 100px"
		/>
		{#if form?.form?.errors?.error_description}
			<div class="invalid-feedback">{form?.form?.errors?.error_description}</div>
		{/if}
	</div>
	<div class="mb-3">
		<label for="main_picture" class="form-label">Main Book Picture</label>
		<input
			class="form-control form-control-lg"
			id="main_picture"
			class:is-invalid={form?.form?.errors?.error_main_picture}
			accept="image/*"
			name="main_picture"
			type="file"
		/>
		{#if form?.form?.errors?.error_main_picture}
			<div class="invalid-feedback">{form?.form?.errors?.error_main_picture}</div>
		{/if}
	</div>
	<div class="mb-3">
		<label for="small_picture" class="form-label">Small Book Picture</label>
		<input
			class="form-control form-control-lg"
			id="small_picture"
			class:is-invalid={form?.form?.errors?.error_small_picture}
			accept="image/*"
			name="small_picture"
			type="file"
		/>
		{#if form?.form?.errors?.error_small_picture}
			<div class="invalid-feedback">{form?.form?.errors?.error_small_picture}</div>
		{/if}
	</div>
	<button disabled={submitting} type="submit" class="btn btn-primary w-100">
		{#if submitting}
			Submitting...
		{:else}
			Submit
		{/if}
	</button>
</form>
