import { db } from '$lib/firebase/firebase.server';

export const load = async () => {
	const count = await db.collection('users').count().get();
	return {
		count: count.data().count
	};
};
