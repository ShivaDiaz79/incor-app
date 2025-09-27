import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - List all roles
export async function GET(req: Request) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const url = new URL(req.url);
    const qs = url.search;

    const upstream = await fetch(`${API_URL}/roles${qs}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Roles GET error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST - Create a new role
export async function POST(req: Request) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const upstream = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Roles POST error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
