import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Check office availability
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

    const upstream = await fetch(
      `${API_URL}/offices/${(await params).id}/availability${qs}`,
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Office availability error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
