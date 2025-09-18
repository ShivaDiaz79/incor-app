import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST() {
	try {
		const API_URL = process.env.API_URL;
		if (!API_URL) {
			return NextResponse.json({ error: "Falta API_URL" }, { status: 500 });
		}

		const cookieStore = cookies();
		const refreshToken = (await cookieStore).get("refreshToken")?.value;

		if (!refreshToken) {
			return NextResponse.json(
				{ error: "No hay refreshToken" },
				{ status: 401 }
			);
		}

		const res = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				refreshToken,
			}),
		});

		const body = await readBody(res);
		if (!res.ok) {
			return NextResponse.json(body ?? { error: "Refresh failed" }, {
				status: res.status,
			});
		}

		const data = body?.data ?? body;
		if (!data?.accessToken || !data?.refreshToken) {
			return NextResponse.json(
				{ error: "Tokens no presentes" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ data, ok: true });
	} catch (e) {
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}

async function readBody(res: Response) {
	const ct = res.headers.get("content-type") || "";
	return ct.includes("application/json") ? await res.json() : await res.text();
}
