import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

function requireEnv() {
	const API_URL = process.env.API_URL;
	if (!API_URL) throw new Error("Falta API_URL");
	return API_URL;
}

async function requireAuth() {
	const accessToken = (await cookies()).get("accessToken")?.value;
	if (!accessToken) {
		return NextResponse.json(
			{ error: "No autenticado: falta accessToken" },
			{ status: 401 }
		);
	}
	return accessToken;
}

async function passThrough(upstream: Response) {
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

export async function POST(req: Request) {
	try {
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const payload = await req.json();

		const upstream = await fetch(`${API_URL}/users/bulk-deactivate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${auth}`,
			},
			body: JSON.stringify(payload),
		});

		const { parsed } = await passThrough(upstream);

		return NextResponse.json(parsed, { status: upstream.status });
	} catch (err) {
		console.error("Users/bulk-deactivate POST error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
