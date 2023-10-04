import { editBook, getBook } from '$lib/firebase/database.sever.js';
import validate from '$lib/validators/book.validator.js';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Book } from '../../../models/book.js';

export const load = async ({ params, locals }) => {
	const book = await getBook(params.id);

	if (!book) {
		throw error(404, { message: 'Book not found!' });
	}

	if (book.user_id !== locals.user.id) {
		throw error(403, { message: 'Access denied.' });
	}

	return { book };
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const book = await getBook(params.id);

		if (!book || book.user_id !== locals.user.id) {
			throw error(403, { message: 'Access denied.' });
		}

		const formData = await request.formData();
		const data = await validate(formData, true);
		if (!data.success) {
			return fail(422, data);
		}

		const bookForUpdate: Book = {
			title: data.book.title as string,
			author: data.book.author as string,
			description: data.book.description as string,
			short_description: data.book.short_description as string,
			main_picture: formData.get('main_picture') as File,
			small_picture: formData.get('small_picture') as File
		};

		await editBook(params.id, bookForUpdate, book.user_id);

		throw redirect(303, `/book/${params.id}`);
	}
};
