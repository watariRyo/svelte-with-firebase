import { goto } from '$app/navigation';

export const afterLogin = async (url: URL) => {
	const route = url.searchParams.get('redirect') || '/';
	goto(route);
};
