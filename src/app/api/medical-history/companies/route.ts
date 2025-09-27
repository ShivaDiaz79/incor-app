import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get available companies
export async function GET(req: Request) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const upstream = await fetch(`${API_URL}/medical-history/companies`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);
    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Medical History companies error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
