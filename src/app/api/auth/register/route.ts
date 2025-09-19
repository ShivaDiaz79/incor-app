import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const runtime = "edge";

const bodySchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	lastName: z.string().min(1),
	phone: z.string().min(6),
	ci: z.string().min(1),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	try {
		const API_URL = process.env.API_URL;
		if (!API_URL) {
			return NextResponse.json({ error: "Falta API_URL" }, { status: 500 });
		}

		const raw = await req.json();
		const parsed = bodySchema.safeParse(raw);
		console.log(parsed);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Datos inválidos", details: parsed.error.format() },
				{ status: 400 }
			);
		}

		const accessToken = (await cookies()).get("accessToken")?.value;
		if (!accessToken) {
			return NextResponse.json(
				{ error: "No autenticado: falta accessToken" },
				{ status: 401 }
			);
		}

		const res = await fetch(`${API_URL}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(parsed.data),
		});

		const contentType = res.headers.get("content-type") || "";
		const body = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		console.log(body);

		return NextResponse.json(body, { status: res.status });
	} catch (err) {
		console.error("Register route error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
