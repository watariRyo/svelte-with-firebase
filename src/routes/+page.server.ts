import { getBooks } from '$lib/firebase/database.sever';

export const load = async ({ locals }) => {
	const books = await getBooks(locals?.user?.id);
	return {
		books
	};
};
