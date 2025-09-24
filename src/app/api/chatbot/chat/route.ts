import { NextResponse } from "next/server";
import { requireEnv, requireAuth, passThrough } from "@/lib/utils/api";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const API_URL = requireEnv();
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    if (!body.message) {
      return NextResponse.json(
        { error: "El campo 'message' es requerido" },
        { status: 400 }
      );
    }

    const upstream = await fetch(`${API_URL}/chatbot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const { parsed } = await passThrough(upstream);

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    console.error("Chatbot chat error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
