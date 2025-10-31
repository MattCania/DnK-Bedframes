import { writable } from 'svelte/store';

export const cartCount = writable(0);

export function setCartCount(n: number) {
	cartCount.set(Math.max(0, Number(n) || 0));
}

export function incCartCount(delta: number) {
	cartCount.update((c) => Math.max(0, (Number(c) || 0) + (Number(delta) || 0)));
}
