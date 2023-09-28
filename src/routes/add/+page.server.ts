import { addBook } from '$lib/firebase/database.sever.js';
import validateBook from '$lib/validators/book.validator.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Book } from '../../models/book.js';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = await validateBook(formData);
		if (!data.success) {
			return fail(422, data);
		}

		const book: Book = {
			title: data.book.title as string,
			author: data.book.author as string,
			description: data.book.description as string,
			short_description: data.book.short_description as string,
			main_picture: data.book.main_picture as File,
			small_picture: data.book.small_picture as File
		};

		const bookId = await addBook(book, locals.user.id);
		throw redirect(303, `/book/${bookId}`);
		// return { success: true };
	}
};
