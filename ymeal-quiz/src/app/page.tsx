"use client";

import { useEffect, useMemo, useState } from "react";

type FormState = { firstName: string; lastName: string; email: string; session: string };

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

export default function Page() {
  const [form, setForm] = useState<FormState>({
  firstName: "",
  lastName: "",
  email: "",
  session: "",
});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  type CapacityState =
  | { capacity: number; matin: { taken: number; remaining: number }; aprem: { taken: number; remaining: number } }
  | null;

  const [capacity, setCapacity] = useState<CapacityState>(null);



const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!canSubmit) return;

  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
  if (data?.error === "session_full") {
    setError("Cette session est complète (20 places). Choisis l'autre session.");
    await refreshCapacity();
    setLoading(false);
    return;
  }

  setError(data?.error || "Une erreur est survenue.");
  setLoading(false);
  return;
}

    setDone(true);
    await refreshCapacity();
  } catch {
    setError("Impossible de contacter le serveur.");
  }

  setLoading(false);
};

  const canSubmit = useMemo(() => {
  return (
    form.firstName.trim().length >= 2 &&
    form.lastName.trim().length >= 2 &&
    isEmail(form.email) &&
    form.session !== "" &&
    !loading
  );
}, [form, loading]);


const remainingLabel = useMemo(() => {
  if (!capacity || !form.session) return null;
  const r =
    form.session === "matin"
      ? capacity.matin.remaining
      : form.session === "aprem"
      ? capacity.aprem.remaining
      : null;

  if (r === null) return null;
  return `${r} place${r > 1 ? "s" : ""} restante${r > 1 ? "s" : ""} / ${capacity.capacity}`;
}, [capacity, form.session]);

  const onChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

    const refreshCapacity = async () => {
  try {
    const r = await fetch("/api/capacity", { cache: "no-store" });
    if (!r.ok) return;
    const j = await r.json();
    setCapacity(j);
  } catch {}
};

useEffect(() => {
  refreshCapacity();
  const t = setInterval(refreshCapacity, 20000);
  return () => clearInterval(t);
}, []);


  return (
    <main className="bg-[#FFF7EC] text-slate-900">
      {/* HERO (inchangé) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#E8E0D5]">
        {/* RAYONS */}
        <div
          className="absolute inset-0 -z-0 opacity-40
          bg-[repeating-conic-gradient(#FFD34A_0deg_12deg,#FFE27A_12deg_24deg)]"
        />

        {/* SOLEIL */}
        <div className="absolute top-[18%] w-[520px] h-[520px] bg-yellow-400 rounded-full -z-0" />

        {/* COLLINE */}
        <div className="absolute bottom-0 w-[1000px] h-[330px] bg-green-600 rounded-t-[1000px] -z-00" />

        {/* CONTENU */}
        <div className="flex flex-col items-center text-center relative z-10 px-6">
          <img src="/titre-ymeal.svg" className="w-[460px] max-w-[90vw] mb-6" />
          <img src="/logo-ymeal.svg" className="w-[300px] max-w-[70vw] mb-6" />

          <h1 className="text-4xl font-black mb-4">Le Quiz Ymeal</h1>

          <p className="text-slate-700 mb-6 max-w-xl">
            Teste tes connaissances sur la cuisine et gagne
            <span className="text-[#FF7A00] font-bold"> 100€</span>
          </p>

          <a
            href="#inscription"
            className="bg-[#FF7A00] text-white px-8 py-4 rounded-xl font-bold shadow-sm hover:shadow-md transition active:scale-[0.99]"
          >
            Je participe
          </a>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
<section className="py-20 px-6">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-12">

      <h2 className="text-3xl md:text-4xl font-black mt-4">Comment ça marche ?</h2>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {/* CARD 1 */}
      <div className="relative rounded-[26px] p-[1px] bg-gradient-to-br from-white/70 via-white/30 to-[#FF7A00]/20">
  <div className="rounded-[25px] bg-white/70 backdrop-blur border border-white/60 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.55)] hover:-translate-y-1 hover:shadow-xl transition">

    <div className="w-9 h-9 rounded-full bg-[#FF7A00] text-white font-black flex items-center justify-center mb-4">
      1
    </div>

    <h3 className="text-lg font-black">Inscris-toi</h3>

    <p className="mt-2 text-slate-600 leading-relaxed">
      Inscris-toi pour participer au quiz et tenter ta chance.
      L'inscription ne prend que quelques secondes.
    </p>

  </div>
</div>

      {/* CARD 2 */}
     <div className="relative rounded-[26px] p-[1px] bg-gradient-to-br from-white/70 via-white/30 to-yellow-200/50">
  <div className="rounded-[25px] bg-white/70 backdrop-blur border border-white/60 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.55)] hover:-translate-y-1 hover:shadow-xl transition">

    <div className="w-9 h-9 rounded-full bg-[#FF7A00] text-white font-black flex items-center justify-center mb-4">
      2
    </div>

    <h3 className="text-lg font-black">Réponds au quiz</h3>

    <p className="mt-2 text-slate-600 leading-relaxed">
      Réponds aux questions et amuse-toi.
      Le thème du quiz : la cuisine, l'alimentation et tout ce qui va avec.
    </p>

  </div>
</div>

      {/* CARD 3 */}
      <div className="relative rounded-[26px] p-[1px] bg-gradient-to-br from-white/70 via-white/30 to-green-200/60">
  <div className="rounded-[25px] bg-white/70 backdrop-blur border border-white/60 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.55)] hover:-translate-y-1 hover:shadow-xl transition">

    <div className="w-9 h-9 rounded-full bg-[#FF7A00] text-white font-black flex items-center justify-center mb-4">
      3
    </div>

    <h3 className="text-lg font-black">Tente de gagner</h3>

    <p className="mt-2 text-slate-600 leading-relaxed">
      Tente de gagner ! Nous avons prévu en tout 
      <span className="font-black text-[#FF7A00]"> 100€ </span>
      de cadeaux pour les participants.
    </p>

  </div>
</div>
    </div>
  </div>
</section>

      {/* INFOS PRATIQUES */}
{/* INFOS PRATIQUES */}
<section className="py-20 px-6">
  <div className="max-w-5xl mx-auto text-center">

    <h2 className="text-3xl md:text-4xl font-black mb-12">
      Infos du Quiz
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      {/* LIEU */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm">
        <img
          src="/patterns/pattern1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative bg-white/85  p-8">
          <p className="text-sm text-slate-500">Lieu</p>
          <p className="font-black text-lg mt-1">Salle 205</p>
        </div>
      </div>

      {/* DURÉE */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm">
        <img
          src="/patterns/pattern2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative bg-white/85  p-8">
          <p className="text-sm text-slate-500">Durée</p>
          <p className="font-black text-lg mt-1">30 minutes</p>
        </div>
      </div>

      {/* PARTICIPANTS */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm">
        <img
          src="/patterns/pattern3.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative bg-white/85  p-8">
          <p className="text-sm text-slate-500">Participants</p>
          <p className="font-black text-lg mt-1">20 par session</p>
        </div>
      </div>

      {/* RÉCOMPENSE */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm">
        <img
          src="/patterns/pattern4.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative bg-white/85  p-8">
          <p className="text-sm text-slate-500">Récompense</p>
          <p className="font-black text-lg mt-1 text-[#FF7A00]">100€</p>
        </div>
      </div>

    </div>

  </div>
</section>

      

      {/* FORMULAIRE (en carte) */}
<section id="inscription" className="py-20 px-6 bg-[#FFF7EC]">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
        Inscris-toi maintenant
      </h2>
      <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
        On prend juste le strict minimum. Promis, on ne vend pas ton âme. Pas encore.
      </p>

      {/* Session picker (plus clean) */}
      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-sm font-bold text-slate-700">
          Choisis ta session
        </span>

        <div className="relative">
          <select
            value={form.session}
            onChange={(e) => setForm((p) => ({ ...p, session: e.target.value }))}
            className="appearance-none bg-white/90 border border-slate-200 rounded-2xl pl-4 pr-10 py-3
                       shadow-sm outline-none transition
                       focus:ring-4 focus:ring-[#FF7A00]/15 focus:border-[#FF7A00]"
          >
            <option value="">Sélectionner</option>
            <option value="matin">Session du matin</option>
            <option value="aprem">Session de l'après-midi</option>
          </select>

          {/* Chevron */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Petit badge capacité */}
        <span className="text-xs font-semibold text-slate-600 bg-white/70 border border-slate-200 px-3 py-2 rounded-full">
          {remainingLabel ?? "20 places / session"}
        </span>
      </div>
    </div>

    {/* Carte */}
    <div className="relative max-w-xl mx-auto">
      {/* Glow subtil */}
      <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-br from-[#FF7A00]/15 via-transparent to-green-500/10 blur-xl" />

      <div className="relative bg-white/90 backdrop-blur border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200 mb-4">
            {error}
          </div>
        )}
        {!done ? (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700">Prénom</label>
                <input
                  placeholder="prénom"
                  className="mt-2 w-full rounded-2xl px-4 py-3
                             bg-slate-50 border border-slate-200
                             outline-none transition
                             focus:bg-white focus:ring-4 focus:ring-[#FF7A00]/15 focus:border-[#FF7A00]"
                  value={form.firstName}
                  onChange={onChange("firstName")}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Nom</label>
                <input
                  placeholder="nom"
                  className="mt-2 w-full rounded-2xl px-4 py-3
                             bg-slate-50 border border-slate-200
                             outline-none transition
                             focus:bg-white focus:ring-4 focus:ring-[#FF7A00]/15 focus:border-[#FF7A00]"
                  value={form.lastName}
                  onChange={onChange("lastName")}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input
                placeholder="tonemail@ynov.com"
                className="mt-2 w-full rounded-2xl px-4 py-3
                           bg-slate-50 border border-slate-200
                           outline-none transition
                           focus:bg-white focus:ring-4 focus:ring-[#FF7A00]/15 focus:border-[#FF7A00]"
                value={form.email}
                onChange={onChange("email")}
              />
            </div>

            <button
              disabled={!canSubmit}
              className="mt-1 rounded-2xl py-4 font-black text-white
                         bg-gradient-to-b from-[#FF8A2A] to-[#FF6A00]
                         shadow-[0_10px_18px_rgba(255,122,0,0.25)]
                         hover:shadow-[0_14px_26px_rgba(255,122,0,0.32)]
                         active:scale-[0.99] transition
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? "Inscription..." : "Je m'inscris"}
            </button>

            <p className="text-xs text-slate-500 text-center">
              En t’inscrivant, tu acceptes qu’on te contacte pour l’événement.
            </p>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-600 text-white font-black flex items-center justify-center mx-auto mb-4 shadow-sm">
              ✓
            </div>
            <h3 className="text-2xl font-black">Inscription confirmée 🎉</h3>
            <p className="text-slate-600 mt-2">On te verra au quiz !</p>
          </div>
        )}
      </div>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        Événement organisé par <span className="font-bold text-slate-700">Ymeal</span>
      </footer>
    </main>
  );
}