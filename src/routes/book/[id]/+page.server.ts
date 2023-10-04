import { getBook } from '$lib/firebase/database.sever.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const book = await getBook(params.id);
	console.log(book);

	if (!book) {
		throw error(404, { message: 'Book not found!' });
	}

	return {
		book
	};
};
