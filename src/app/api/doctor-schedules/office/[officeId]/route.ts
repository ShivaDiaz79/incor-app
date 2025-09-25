import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get schedules by office ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ officeId: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const url = new URL(req.url);
    const qs = url.search;

    const upstream = await fetch(
      `${API_URL}/doctor-schedules/office/${(await params).officeId}${qs}`,
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Doctor schedules by office error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
