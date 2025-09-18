/* eslint-disable @typescript-eslint/no-explicit-any */

export async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
	const res = await fetch(url, {
		...init,
		headers: { "Content-Type": "application/json", ...(init.headers || {}) },
	});
	if (!res.ok) {
		let body: any;
		try {
			body = await res.json();
		} catch {
			body = await res.text();
		}
		const err = new Error(`HTTP ${res.status}`);
		(err as any).status = res.status;
		(err as any).body = body;
		throw err;
	}
	return (await res.json()) as T;
}
