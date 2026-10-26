import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  RotateCcw,
  Send,
  Ticket,
} from "lucide-react";
import {
  CATEGORIES,
  COLUMNS,
  PRIORITIES,
  priorityById,
  relTime,
  slaLeft,
} from "./data/tickets";
import {
  createTicket,
  loadTickets,
  moveTicket,
  resetTickets,
} from "./utils/tickets";

function PriorityBadge({ id }) {
  const p = priorityById(id);
  return (
    <span className={"rounded-full px-2 py-0.5 text-[10px] font-extrabold " + p.style}>
      {p.label}
    </span>
  );
}

function TicketCard({ t, onMove }) {
  const [open, setOpen] = useState(false);
  const left = slaLeft(t);
  const done = t.status === "selesai";
  return (
    <div className="rounded-xl border border-edge bg-card p-3 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-bold text-bluez">{t.id}</span>
          <PriorityBadge id={t.priority} />
        </div>
        <p className="mt-1 text-sm font-bold leading-snug text-ink">{t.subject}</p>
        <p className="mt-1 text-[11px] font-semibold text-mute">
          {t.name} · {t.category} · {relTime(t.createdAt)}
        </p>
        {open && (
          <p className="mt-2 rounded-lg bg-canvas p-2.5 text-xs leading-relaxed text-ink">
            {t.message}
          </p>
        )}
        {!done && (
          <p
            className={
              "mt-2 inline-flex items-center gap-1 text-[10px] font-bold " +
              (left < 0 ? "text-rose-600" : "text-emerald-600")
            }
          >
            <Clock className="h-3 w-3" />
            {left < 0
              ? `SLA lewat ${Math.abs(left)} jam`
              : `SLA sisa ${left} jam`}
          </p>
        )}
        {done && (
          <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> Terselesaikan
          </p>
        )}
      </button>
      <div className="mt-2.5 flex items-center justify-between border-t border-edge pt-2">
        <button
          onClick={() => onMove(t.id, -1)}
          disabled={t.status === "baru"}
          className="inline-flex items-center gap-1 rounded-lg border border-edge px-2 py-1 text-[10px] font-bold text-mute transition hover:text-ink disabled:opacity-30"
        >
          <ArrowLeft className="h-3 w-3" /> Mundur
        </button>
        <button
          onClick={() => onMove(t.id, 1)}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-lg bg-bluez px-2 py-1 text-[10px] font-bold text-white transition hover:brightness-110 disabled:opacity-30"
        >
          {done ? "Selesai" : t.status === "baru" ? "Proses" : "Tutup"}{" "}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function Board({ tickets, onMove, onReset }) {
  const openCount = tickets.filter((t) => t.status !== "selesai").length;
  const urgentOpen = tickets.filter(
    (t) => t.priority === "urgent" && t.status !== "selesai"
  ).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-xs font-bold">
          <span className="rounded-full border border-edge bg-card px-3 py-1.5 text-ink">
            Terbuka: {openCount}
          </span>
          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-rose-600">
            Urgent aktif: {urgentOpen}
          </span>
          <span className="hidden rounded-full border border-edge bg-card px-3 py-1.5 text-mute sm:inline">
            Total: {tickets.length}
          </span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-card px-3 py-1.5 text-xs font-bold text-mute transition hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset demo
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tickets
            .filter((t) => t.status === col.id)
            .sort((a, b) => a.createdAt - b.createdAt);
          return (
            <div key={col.id} className="rounded-2xl border border-edge bg-canvas p-3">
              <div className="flex items-center justify-between px-1 pb-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-mute">
                  {col.label}
                </p>
                <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-extrabold text-ink">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-edge p-4 text-center text-xs text-mute">
                    Kosong
                  </p>
                )}
                {items.map((t) => (
                  <TicketCard key={t.id} t={t} onMove={onMove} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Form({ onCreated }) {
  // onCreated(next) dipanggil dengan list terbaru agar papan agent ikut ter-update
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState("normal");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 3) return setError("Nama minimal 3 karakter.");
    if (!contact.trim()) return setError("Email / nomor WA wajib diisi.");
    if (subject.trim().length < 5)
      return setError("Judul tiket minimal 5 karakter.");
    if (message.trim().length < 10)
      return setError("Ceritakan masalahnya minimal 10 karakter.");
    const { ticket, next } = createTicket({
      name: name.trim(),
      contact: contact.trim(),
      category,
      priority,
      subject: subject.trim(),
      message: message.trim(),
    });
    onCreated(next);
    setCode(ticket.id);
    setName("");
    setContact("");
    setSubject("");
    setMessage("");
    setPriority("normal");
  };

  return (
    <div className="mx-auto max-w-xl">
      {code ? (
        <div className="rounded-2xl border border-edge bg-card p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h3 className="mt-3 text-lg font-extrabold text-ink">Tiket Dibuat</h3>
          <p className="mt-1 text-sm text-mute">
            Simpan nomor tiket ini untuk memantau balasan agen.
          </p>
          <p className="mt-4 rounded-xl border-2 border-dashed border-bluez/40 bg-bluez/5 px-6 py-3 font-mono text-2xl font-extrabold text-bluez">
            {code}
          </p>
          <button
            onClick={() => setCode(null)}
            className="mt-5 rounded-full bg-bluez px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            Buat Tiket Lain
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-2xl border border-edge bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-mute">
                Nama
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="mt-1 w-full rounded-xl border border-edge bg-canvas px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-bluez"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-mute">
                Email / No. WA
              </span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="nama@mail.com"
                className="mt-1 w-full rounded-xl border border-edge bg-canvas px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-bluez"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-mute">
                Kategori
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-edge bg-canvas px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-bluez"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-mute">
                Prioritas
              </span>
              <div className="mt-1 flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={
                      "flex-1 rounded-xl border px-2 py-2 text-xs font-bold transition " +
                      (priority === p.id
                        ? "border-bluez bg-bluez/10 text-bluez"
                        : "border-edge bg-canvas text-mute hover:text-ink")
                    }
                  >
                    {p.label}
                    <span className="block text-[9px] font-semibold opacity-70">
                      SLA {p.sla}j
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label className="mt-4 block">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-mute">
              Judul masalah
            </span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="cth. Paket tidak bergerak 4 hari"
              className="mt-1 w-full rounded-xl border border-edge bg-canvas px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-bluez"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-mute">
              Detail
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Ceritakan masalahnya — nomor pesanan, waktu kejadian, apa yang sudah dicoba…"
              className="mt-1 w-full resize-none rounded-xl border border-edge bg-canvas px-3 py-2.5 text-sm font-semibold text-ink outline-none placeholder:font-normal focus:border-bluez"
            />
          </label>
          {error && (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bluez px-5 py-3 text-sm font-extrabold text-white transition hover:brightness-110"
          >
            <Send className="h-4 w-4" /> Kirim Tiket
          </button>
        </form>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("board");
  const [tickets, setTickets] = useState(() => loadTickets());

  const onMove = (id, dir) => setTickets(moveTicket(id, dir));

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      {/* topbar */}
      <header className="border-b border-edge bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5 md:px-8">
          <p className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <Ticket className="h-5 w-5 text-bluez" />
            Tike<span className="text-bluez">tara</span>
          </p>
          <nav className="flex rounded-xl border border-edge bg-canvas p-1">
            <button
              onClick={() => setTab("board")}
              className={
                "inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition " +
                (tab === "board"
                  ? "bg-card text-ink shadow-sm"
                  : "text-mute hover:text-ink")
              }
            >
              <Inbox className="h-3.5 w-3.5" /> Papan Agent
            </button>
            <button
              onClick={() => setTab("form")}
              className={
                "inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition " +
                (tab === "form"
                  ? "bg-card text-ink shadow-sm"
                  : "text-mute hover:text-ink")
              }
            >
              <Send className="h-3.5 w-3.5" /> Buat Tiket
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <p className="text-center text-sm leading-relaxed text-mute">
          {tab === "board"
            ? "Geser tiket antar kolom: Baru → Diproses → Selesai. SLA dihitung dari prioritas tiket."
            : "Form pelanggan: tiket baru langsung muncul di Papan Agent dengan nomor tiket."}
        </p>
        <div className="mt-6">
          {tab === "board" ? (
            <Board
              tickets={tickets}
              onMove={onMove}
              onReset={() => setTickets(resetTickets())}
            />
          ) : (
            <Form onCreated={(next) => setTickets(next)} />
          )}
        </div>
      </main>

      <footer className="border-t border-edge bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-mute sm:flex-row sm:items-center md:px-8">
          <p>© 2026 Tiketara. Semua pelanggan & tiket fiktif (concept demo).</p>
          <p>
            Web app ringan — dibuat oleh{" "}
            <a
              href="https://github.com/Atazyyy"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-ink"
            >
              Agni Miftah Fauzi
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
