import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

type Params = { id: string };

export async function GET(_req: Request, ctx: { params: Promise<Params> }) {
	try {
		const { id } = await ctx.params;
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const upstream = await fetch(`${API_URL}/patients/${id}`, {
			headers: { Authorization: `Bearer ${auth}` },
		});

		const { parsed } = await passThrough(upstream);

		return NextResponse.json(parsed, { status: upstream.status });
	} catch (err) {
		console.error("Patients/:id GET error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}

export async function PATCH(req: Request, ctx: { params: Promise<Params> }) {
	try {
		const { id } = await ctx.params;
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const payload = await req.json();

		const upstream = await fetch(`${API_URL}/patients/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${auth}`,
			},
			body: JSON.stringify(payload),
		});

		const { parsed } = await passThrough(upstream);

		return NextResponse.json(parsed, { status: upstream.status });
	} catch (err) {
		console.error("Patients/:id PATCH error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}

export async function DELETE(_req: Request, ctx: { params: Promise<Params> }) {
	try {
		const { id } = await ctx.params;
		const API_URL = requireEnv();
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		const upstream = await fetch(`${API_URL}/patients/${id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${auth}` },
		});

		const { parsed } = await passThrough(upstream);

		return NextResponse.json(parsed, { status: upstream.status });
	} catch (err) {
		console.error("Patients/:id DELETE error:", err);
		return NextResponse.json({ error: "Error interno" }, { status: 500 });
	}
}
