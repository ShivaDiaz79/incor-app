import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

function requireEnv() {
	const API_URL = process.env.API_URL;
	if (!API_URL) throw new Error("Falta API_URL");
	return API_URL;
}

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

			upstreamBody =
				upstreamStatus === 204 ? null : await readUpstream(upstream);
		}

		const res =
			upstreamStatus === 204
				? new NextResponse(null, { status: 204 })
				: NextResponse.json(upstreamBody ?? { ok: true }, {
						status: upstreamStatus,
				  });

		const commonCookie = {
			path: "/",
			httpOnly: true,
			sameSite: "lax" as const,
			secure: process.env.NODE_ENV === "production",
			expires: new Date(0),
		};
		res.cookies.set({ name: "accessToken", value: "", ...commonCookie });
		res.cookies.set({ name: "refreshToken", value: "", ...commonCookie });

		return res;
	} catch (err) {
		console.error("Logout route error:", err);
		const res = NextResponse.json({ error: "Error interno" }, { status: 500 });
		const commonCookie = {
			path: "/",
			httpOnly: true,
			sameSite: "lax" as const,
			secure: process.env.NODE_ENV === "production",
			expires: new Date(0),
		};
		res.cookies.set({ name: "accessToken", value: "", ...commonCookie });
		res.cookies.set({ name: "refreshToken", value: "", ...commonCookie });
		return res;
	}
}
