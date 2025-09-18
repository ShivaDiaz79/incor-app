import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET(req: Request) {
	try {
		const API_URL = process.env.API_URL;
		if (!API_URL) {
			return NextResponse.json({ error: "Falta API_URL" }, { status: 500 });
		}

		const accessToken = (await cookies()).get("accessToken")?.value;
		if (!accessToken) {
			return NextResponse.json(
				{ error: "No autenticado: falta accessToken" },
				{ status: 401 }
			);
		}

		const res = await fetch(`${API_URL}/auth/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const contentType = res.headers.get("content-type") || "";
		const body = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		return NextResponse.json(body, { status: res.status });
	} catch (err) {
		console.error("Register route error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
