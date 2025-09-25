import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get doctor schedule for specific date
export async function GET(
  req: Request,
  { params }: { params: Promise<{ doctorUserId: string; date: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const url = new URL(req.url);
    const qs = url.search;

    const resolvedParams = await params;
    const upstream = await fetch(
      `${API_URL}/doctor-schedules/doctor/${resolvedParams.doctorUserId}/date/${resolvedParams.date}${qs}`,
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Doctor schedule for date error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
