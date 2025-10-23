// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { DefaultSession } from "@auth/core/types";
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    userId?: string;
    role?: string;
    fullname?: string;
    contacts?: string | null;
    birthday?: string | null;
    address?: string | null;
    gender?: string | null;
  }

  interface JWT {
    userId?: string;
    role?: string;
    fullname?: string;
    contacts?: string | null;
    birthday?: string | null;
    address?: string | null;
    gender?: string | null;
  }
}

declare module "@auth/sveltekit" {
  interface Session extends DefaultSession {
    userId?: string;
    role?: string;
    fullname?: string;
    contacts?: string | null;
    birthday?: string | null;
    address?: string | null;
    gender?: string | null;
  }

  interface JWT {
    userId?: string;
    role?: string;
    fullname?: string;
    contacts?: string | null;
    birthday?: string | null;
    address?: string | null;
    gender?: string | null;
  }
}
export {};
