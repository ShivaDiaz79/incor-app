import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { AuthResponse } from "@/features/auth/types";

const bodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const parsed = bodySchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Datos inválidos", details: parsed.error.format() },
				{ status: 400 }
			);
		}

		const { email, password } = parsed.data;

		const API_URL = process.env.API_URL;
		if (!API_URL) {
			console.error("Falta API_URL");
			return NextResponse.json(
				{ error: "Error del servidor" },
				{ status: 500 }
			);
		}

		const res = await fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!res.ok) {
			let errBody: unknown;
			try {
				errBody = await res.json();
			} catch {
				errBody = { error: "Error al autenticar" };
			}
			return NextResponse.json(errBody, { status: res.status });
		}

		const apiResponse = (await res.json()) as AuthResponse;
		const { data } = apiResponse;

		const cookieStore = cookies();
		const maxAge = data?.expiresIn ?? 60 * 60 * 24 * 7;

		if (data?.accessToken) {
			(await cookieStore).set({
				name: "accessToken",
				value: data.accessToken,
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge,
			});
		}

		if (data?.refreshToken) {
			(await cookieStore).set({
				name: "refreshToken",
				value: data.refreshToken,
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge,
			});
		}

		return NextResponse.json(apiResponse, {
			status: apiResponse.statusCode ?? 200,
		});
	} catch (err) {
		console.error("Auth route error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
