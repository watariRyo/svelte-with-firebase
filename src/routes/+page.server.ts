import { getBooks } from '$lib/firebase/database.sever';

export const load = async ({ locals, url }) => {
	const page = Number(url.searchParams.get('page') || 1);
	const { books, next, previous } = await getBooks(locals?.user?.id, +page);
	return {
		books,
		next,
		previous,
		page
	};
};
