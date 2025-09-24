// app/api/doctors/available-users/route.ts
import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

// GET - Get users available to become doctors
export async function GET(req: Request) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const url = new URL(req.url);
    const searchParam = url.searchParams.get("search") || "";

    // Get users with doctor role and active status
    const queryParams = new URLSearchParams({
      roleId: "doctor",
      isActive: "true",
      limit: "100",
      sortBy: "name",
      sortOrder: "asc",
    });

    if (searchParam) {
      queryParams.append("search", searchParam);
    }

    const upstream = await fetch(`${API_URL}/users?${queryParams}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Available users GET error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
