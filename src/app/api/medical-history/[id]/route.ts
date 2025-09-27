import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get medical history by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const upstream = await fetch(`${API_URL}/medical-history/${id}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);
    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Medical History GET by ID error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH - Update medical history
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
    const upstream = await fetch(`${API_URL}/medical-history/${id}`, {
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
    console.error("Medical History PATCH error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE - Deactivate medical history
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const upstream = await fetch(`${API_URL}/medical-history/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);
    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Medical History DELETE error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
