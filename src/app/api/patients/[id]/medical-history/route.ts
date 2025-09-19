import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

type Params = { id: string };

export async function POST(req: Request, ctx: { params: Promise<Params> }) {
	try {
		const { id } = await ctx.params;
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const payload = await req.json();

		const upstream = await fetch(`${API_URL}/patients/${id}/medical-history`, {
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
		console.error("Patients/:id/medical-history POST error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
