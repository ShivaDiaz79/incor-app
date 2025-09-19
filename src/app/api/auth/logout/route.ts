import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

function requireEnv() {
	const API_URL = process.env.API_URL;
	if (!API_URL) throw new Error("Falta API_URL");
	return API_URL;
}

/** Helper para leer body/text o json de la API upstream sin romper si no es JSON */
async function readUpstream(up: Response) {
	const ct = up.headers.get("content-type") || "";
	if (ct.includes("application/json")) {
		try {
			return await up.json();
		} catch {
			return { message: "Respuesta JSON inválida" };
		}
	}
	const text = await up.text();
	try {
<<<<<<< HEAD
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
=======
		return JSON.parse(text);
	} catch {
		return { message: text || "Sin contenido" };
	}
}

export async function POST() {
	try {
		const API_URL = requireEnv();
		const store = await cookies();

		const accessToken = store.get("accessToken")?.value;
		const refreshToken = store.get("refreshToken")?.value;

		let upstreamStatus = 200;
		let upstreamBody: unknown = { message: "Sesión finalizada localmente" };

		if (accessToken) {
			const upstream = await fetch(`${API_URL}/auth/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
			upstreamStatus = upstream.status;
			upstreamBody = await readUpstream(upstream);
		}

		const res = NextResponse.json(upstreamBody, { status: upstreamStatus });

		const expired = new Date(0).toUTCString();
		res.cookies.set({
			name: "accessToken",
			value: "",
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			expires: new Date(0),
		});
		res.cookies.set({
			name: "refreshToken",
			value: "",
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			expires: new Date(0),
		});

		return res;
	} catch (err) {
		console.error("Logout route error:", err);

		const res = NextResponse.json({ error: "Error interno" }, { status: 500 });
		res.cookies.set({
			name: "accessToken",
			value: "",
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			expires: new Date(0),
		});
		res.cookies.set({
			name: "refreshToken",
			value: "",
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			expires: new Date(0),
		});
		return res;
>>>>>>> main
	}
}
