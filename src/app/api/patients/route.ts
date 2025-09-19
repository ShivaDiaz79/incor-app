import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

export async function GET(req: Request) {
	try {
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const url = new URL(req.url);
		const qs = url.search;
		const upstream = await fetch(`${API_URL}/patients${qs}`, {
			headers: { Authorization: `Bearer ${auth}` },
		});

		const { parsed } = await passThrough(upstream);

		return NextResponse.json(parsed, { status: upstream.status });
	} catch (err) {
		console.error("Patients GET error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const payload = await req.json();

		const upstream = await fetch(`${API_URL}/patients`, {
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
		console.error("Patients POST error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
