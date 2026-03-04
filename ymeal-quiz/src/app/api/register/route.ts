// app/api/register/route.ts
import { NextResponse } from "next/server";

const CAPACITY_PER_SESSION = 20;

function clean(v: unknown) {
  return String(v ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email).toLowerCase();
    const session = clean(body.session); // "matin" | "aprem"

    if (!firstName || !lastName || !email || (session !== "matin" && session !== "aprem")) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listMatin = process.env.BREVO_LIST_ID_MATIN;
    const listAprem = process.env.BREVO_LIST_ID_APREM;

    if (!apiKey || !listMatin || !listAprem) {
      return NextResponse.json({ error: "missing_env" }, { status: 500 });
    }

    const listId = session === "matin" ? listMatin : listAprem;

    // 1) Check taille de liste (cap 20)
    const listRes = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}`, {
      headers: { "api-key": apiKey, accept: "application/json" },
      cache: "no-store",
    });

    if (!listRes.ok) {
      return NextResponse.json({ error: "brevo_list_fetch_failed" }, { status: 502 });
    }

    const listJson = await listRes.json();
    const totalSubscribers = Number(listJson?.totalSubscribers ?? 0);

    if (totalSubscribers >= CAPACITY_PER_SESSION) {
      return NextResponse.json({ error: "session_full" }, { status: 409 });
    }

    // 2) Upsert contact dans la liste
    const createRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName, LASTNAME: lastName, SESSION: session },
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
    });

    if (!createRes.ok) {
      const txt = await createRes.text();
      return NextResponse.json({ error: "brevo_create_failed", details: txt }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "unknown_error" }, { status: 500 });
  }
}