// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user_ip: string | undefined;
			user_agent: string | undefined;
			referrer: string | undefined;
			session_id: number | undefined;
			session_start: Date | undefined;
			page_count: number;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
