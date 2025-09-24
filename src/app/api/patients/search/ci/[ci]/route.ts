// app/api/patients/search/ci/[ci]/route.ts
import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Search patient by CI
export async function GET(
  req: Request,
  { params }: { params: Promise<{ ci: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { ci } = await params;

    const upstream = await fetch(`${API_URL}/patients/search/ci/${ci}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Patient search by CI error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
