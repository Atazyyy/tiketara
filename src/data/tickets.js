export const CATEGORIES = [
  "Pesanan & Pengiriman",
  "Pembayaran",
  "Teknis / Bug",
  "Akun & Login",
  "Lainnya",
];

export const PRIORITIES = [
  { id: "urgent", label: "Urgent", sla: 4, style: "bg-rose-100 text-rose-700" },
  { id: "tinggi", label: "Tinggi", sla: 8, style: "bg-amber-100 text-amber-700" },
  { id: "normal", label: "Normal", sla: 24, style: "bg-sky-100 text-sky-700" },
];

export const COLUMNS = [
  { id: "baru", label: "Tiket Baru" },
  { id: "diproses", label: "Diproses" },
  { id: "selesai", label: "Selesai" },
];

export const priorityById = (id) =>
  PRIORITIES.find((p) => p.id === id) || PRIORITIES[2];

export const relTime = (ts) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
};

/* Sisa waktu SLA (jam). Negatif = lewat batas */
export const slaLeft = (t) => {
  const p = priorityById(t.priority);
  const due = t.createdAt + p.sla * 3600000;
  return Math.round((due - Date.now()) / 3600000);
};
