import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const runtime = "edge";

const userCreateSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	lastName: z.string().min(1),
	phone: z.string().min(6),
	roleId: z.string().min(1),
	ci: z.string().min(1),
	isActive: z.boolean().optional(),
	firebaseUid: z.string().min(1).optional(),
	password: z.string().min(8).optional(),
});

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

async function parseBody<T>(req: Request, schema: z.ZodSchema<T>) {
	const raw = await req.json();
	const parsed = schema.safeParse(raw);
	if (!parsed.success) {
		return {
			ok: false as const,
			res: NextResponse.json(
				{ error: "Datos inválidos", details: parsed.error.format() },
				{ status: 400 }
			),
		};
	}
	return { ok: true as const, data: parsed.data };
}

function passThrough(res: Response) {
	const contentType = res.headers.get("content-type") || "";
	return contentType.includes("application/json") ? res.json() : res.text();
}

export async function POST(req: Request) {
	try {
		const API_URL = requireEnv();

		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const parsed = await parseBody(req, userCreateSchema);
		if (!parsed.ok) return parsed.res;

		const upstream = await fetch(`${API_URL}/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${auth}`,
			},
			body: JSON.stringify(parsed.data),
		});

		const body = await passThrough(upstream);

		return NextResponse.json(body, { status: upstream.status });
	} catch (err) {
		console.error("Users POST error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const url = new URL(req.url);
		const qs = url.search ? url.search : "";

		const upstream = await fetch(`${API_URL}/users${qs}`, {
			headers: { Authorization: `Bearer ${auth}` },
		});

		const body = await passThrough(upstream);

		return NextResponse.json(body, { status: upstream.status });
	} catch (err) {
		console.error("Users GET error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
