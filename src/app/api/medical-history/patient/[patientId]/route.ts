import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get medical history by patient ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { patientId } = await params;
    const upstream = await fetch(
      `${API_URL}/medical-history/patient/${patientId}`,
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    const { parsed } = await passThrough(upstream);
    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Medical History by patient error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
