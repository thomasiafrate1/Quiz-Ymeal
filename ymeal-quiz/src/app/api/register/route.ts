import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "registrations.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function ticket() {
  // Ticket lisible: YM-482917
  return `YM-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const school = String(body.school ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json({ error: "Prénom/nom invalides." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    ensureFile();
    const raw = fs.readFileSync(FILE, "utf-8");
    const list = JSON.parse(raw) as any[];

    // Empêche doubles inscriptions email
    if (list.some((x) => String(x.email).toLowerCase() === email)) {
      return NextResponse.json({ error: "Cet email est déjà inscrit." }, { status: 409 });
    }

    const item = {
      id: crypto.randomUUID(),
      ticket: ticket(),
      firstName,
      lastName,
      email,
      school,
      phone,
      createdAt: new Date().toISOString(),
    };

    list.unshift(item);
    fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");

    return NextResponse.json({ ok: true, ticket: item.ticket });
  } catch (e: any) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}