// app/api/capacity/route.ts
import { NextResponse } from "next/server";

const CAPACITY_PER_SESSION = 20;

export async function GET() {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const listMatin = process.env.BREVO_LIST_ID_MATIN;
    const listAprem = process.env.BREVO_LIST_ID_APREM;

    if (!apiKey || !listMatin || !listAprem) {
      return NextResponse.json({ error: "missing_env" }, { status: 500 });
    }

    const fetchCount = async (listId: string) => {
      const r = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}`, {
        headers: { "api-key": apiKey, accept: "application/json" },
        cache: "no-store",
      });
      if (!r.ok) throw new Error("brevo_list_fetch_failed");
      const j = await r.json();
      return Number(j?.totalSubscribers ?? 0);
    };

    const [m, a] = await Promise.all([fetchCount(listMatin), fetchCount(listAprem)]);

    return NextResponse.json(
      {
        capacity: CAPACITY_PER_SESSION,
        matin: { taken: m, remaining: Math.max(0, CAPACITY_PER_SESSION - m) },
        aprem: { taken: a, remaining: Math.max(0, CAPACITY_PER_SESSION - a) },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "unknown_error" }, { status: 500 });
  }
}