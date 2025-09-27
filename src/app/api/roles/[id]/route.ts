import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get role by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const url = new URL(req.url);
    const qs = url.search;

    const { id } = await params;
    const upstream = await fetch(`${API_URL}/roles/${id}${qs}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Role GET error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH - Update role
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const { id } = await params;
    const upstream = await fetch(`${API_URL}/roles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Role PATCH error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE - Delete role
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const upstream = await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth}` },
    });

    if (upstream.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const { parsed } = await passThrough(upstream);
    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Role DELETE error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
