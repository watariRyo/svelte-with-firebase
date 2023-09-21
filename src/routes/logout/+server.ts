import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('jwt');
	return json({ message: 'success' }, { status: 200 });
};
