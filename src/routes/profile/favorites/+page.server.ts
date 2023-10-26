import { getLikeBooks } from '$lib/firebase/database.sever.js';

export const load = async ({ locals }) => {
	const books = await getLikeBooks(locals.user.id);

	return { books };
};
