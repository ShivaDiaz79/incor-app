import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// PATCH - Activate doctor schedule
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const upstream = await fetch(
      `${API_URL}/doctor-schedules/${(await params).id}/activate`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Doctor schedule activate error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
