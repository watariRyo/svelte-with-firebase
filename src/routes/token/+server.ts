import { json, type RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/firebase/firebase.server';

/**@type {import ('./$types').RequestHandler} */
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { token, email } = await request.json();
		const verfiedToken = await auth.verifyIdToken(token ?? '', true);

		if (verfiedToken.email === email) {
			cookies.set('jwt', token, {
				maxAge: verfiedToken.exp - Date.now() / 1000,
				path: '/'
			});

			return json({ message: 'success' }, { status: 200 });
		}

		return json({ message: 'Access denied' }, { status: 403 });
	} catch (error: any) {
		return json({ message: 'Access denied' }, { status: 403 });
	}
};
