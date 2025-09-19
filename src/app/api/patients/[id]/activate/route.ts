import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

type Params = { id: string };

export async function PATCH(req: Request, ctx: { params: Promise<Params> }) {
	try {
		const { id } = await ctx.params;
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		let payload: unknown;
		let hasBody = false;
		try {
			payload = await req.json();
			hasBody = true;
		} catch {
			hasBody = false;
		}

		const upstream = await fetch(`${API_URL}/patients/${id}/activate`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${auth}`,
				...(hasBody ? { "Content-Type": "application/json" } : {}),
			},
			...(hasBody ? { body: JSON.stringify(payload) } : {}),
		});

		const { parsed } = await passThrough(upstream);

		return NextResponse.json(parsed, { status: upstream.status });
	} catch (err) {
		console.error("Patients/:id/activate PATCH error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
