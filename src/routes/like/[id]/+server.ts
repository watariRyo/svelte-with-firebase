import { getBook, toggleBookLike } from '$lib/firebase/database.sever.js';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(403, { message: 'Access denied.' });
	}

	const book = await getBook(params.id);
	if (!book) {
		throw error(404, { message: 'Book not found.' });
	}

	try {
		const newBook = await toggleBookLike(params.id, locals.user.id);
		return json({ ...newBook });
	} catch (e: any) {
		console.log(e);
		throw error(500, { message: 'Server error.' });
	}
};
