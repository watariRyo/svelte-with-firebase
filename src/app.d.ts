// See https://kit.svelte.dev/docs/types#app

import type { UserAuth } from './models/user';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserAuth;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
