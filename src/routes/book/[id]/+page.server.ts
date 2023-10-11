import { getBook } from '$lib/firebase/database.sever.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const book = await getBook(params.id, locals?.user?.id);
	console.log(book);

	if (!book) {
		throw error(404, { message: 'Book not found!' });
	}

	return {
		book
	};
};
