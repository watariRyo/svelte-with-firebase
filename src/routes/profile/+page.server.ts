import { getBooksForUser } from '$lib/firebase/database.sever.js';

export const load = async ({ locals }) => {
	const books = await getBooksForUser(locals.user.id);

	console.log(books);

	return { books };
};
