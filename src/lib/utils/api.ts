import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export function requireEnv() {
	const API_URL = process.env.API_URL;
	if (!API_URL) throw new Error("Falta API_URL");
	return API_URL;
}

export async function requireAuth(): Promise<
	string | NextResponse<{ error: string }>
> {
	const accessToken = (await cookies()).get("accessToken")?.value;
	if (!accessToken) {
		return NextResponse.json(
			{ error: "No autenticado: falta accessToken" },
			{ status: 401 }
		);
	}
	return accessToken;
}

export async function passThrough(upstream: Response) {
	const contentType = upstream.headers.get("content-type") || "";
	try {
		if (contentType.includes("application/json")) {
			const json = await upstream.json();
			return { parsed: json, isJson: true as const };
		}
		const text = await upstream.text();
		try {
			const maybe = JSON.parse(text);
			return { parsed: maybe, isJson: true as const };
		} catch {
			return { parsed: { raw: text }, isJson: false as const };
		}
	} catch {
		return {
			parsed: { error: "No se pudo leer respuesta" },
			isJson: true as const,
		};
	}
}
