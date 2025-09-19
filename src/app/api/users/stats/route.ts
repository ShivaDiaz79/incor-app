import { NextResponse } from "next/server";
import { passThrough, requireAuth, requireEnv } from "@/lib/utils/api";

export const runtime = "edge";

export async function GET() {
	try {
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const upstream = await fetch(`${API_URL}/users/stats`, {
			headers: { Authorization: `Bearer ${auth}` },
		});

		const { parsed } = await passThrough(upstream);

		return NextResponse.json(parsed, { status: upstream.status });
	} catch (err) {
		console.error("Users stats GET error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
