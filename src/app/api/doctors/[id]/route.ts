// app/api/doctors/[id]/route.ts
import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get doctor by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const upstream = await fetch(`${API_URL}/doctors/${params.id}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Doctor GET error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH - Update doctor
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const upstream = await fetch(`${API_URL}/doctors/${params.id}`, {
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
    console.error("Doctor PATCH error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE - Deactivate doctor
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const upstream = await fetch(`${API_URL}/doctors/${params.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Doctor DELETE error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
