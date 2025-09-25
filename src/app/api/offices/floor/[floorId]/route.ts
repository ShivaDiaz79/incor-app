import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get offices by floor
export async function GET(
  req: Request,
  { params }: { params: Promise<{ floorId: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const upstream = await fetch(
      `${API_URL}/offices/floor/${(await params).floorId}`,
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Offices by floor error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
