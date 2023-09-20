import { goto } from '$app/navigation';
import { sendJWTToken } from '$lib/firebase/auth.client';
import { setUser } from '$lib/firebase/database.client';

export const afterLogin = async (url: URL, userId: string) => {
	const route = url.searchParams.get('redirect') || '/';
	await setUser(userId);
	await sendJWTToken();
	await goto(route);
};
