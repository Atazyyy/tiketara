const KEY = "tkt-tickets-v1";
const STATUSES = ["baru", "diproses", "selesai"];

const H = 3600000;

function seedTickets() {
  const now = Date.now();
  return [
    {
      id: "TK-8812",
      name: "Dewi Kartika",
      contact: "dewi@mail.com",
      category: "Pesanan & Pengiriman",
      priority: "urgent",
      subject: "Paket tidak bergerak 4 hari",
      message:
        "Nomor resi  BP123456789 sudah 4 hari tidak update dari gudang Bandung. Tolong dicek ya, pembeli sudah komplain dua kali.",
      status: "baru",
      createdAt: now - 2 * H,
    },
    {
      id: "TK-8813",
      name: "Rangga M.",
      contact: "0812xxxx9981",
      category: "Pembayaran",
      priority: "tinggi",
      subject: "Transfer diterima tapi status belum lunas",
      message:
        "Sudah transfer Rp350.000 kemarin sore, bukti ada. Status pesanan masih 'menunggu pembayaran'.",
      status: "baru",
      createdAt: now - 5 * H,
    },
    {
      id: "TK-8814",
      name: "Sinta Ayu",
      contact: "sinta.ayu@mail.com",
      category: "Akun & Login",
      priority: "normal",
      subject: "Tidak bisa reset password",
      message:
        "Email reset password tidak masuk ke inbox maupun spam. Sudah coba 3 kali.",
      status: "baru",
      createdAt: now - 9 * H,
    },
    {
      id: "TK-8815",
      name: "Bagas P.",
      contact: "0857xxxx1120",
      category: "Teknis / Bug",
      priority: "tinggi",
      subject: "Tombol checkout error di iPhone",
      message:
        "Safari iPhone 13: klik 'Bayar Sekarang' muncul layar putih. Di Chrome Android normal.",
      status: "diproses",
      createdAt: now - 20 * H,
    },
    {
      id: "TK-8816",
      name: "Maya Puspita",
      contact: "maya.p@mail.com",
      category: "Lainnya",
      priority: "normal",
      subject: "Minta faktur pajak",
      message: "Halo, saya butuh faktur pajak untuk 3 pesanan bulan ini. Terima kasih.",
      status: "diproses",
      createdAt: now - 26 * H,
    },
    {
      id: "TK-8817",
      name: "Fikri R.",
      contact: "0813xxxx7781",
      category: "Pesanan & Pengiriman",
      priority: "normal",
      subject: "Minta ganti alamat kirim",
      message:
        "Pesanan #1092 masih dikirim ke alamat lama. Tolong diarahkan ke alamat baru yang saya tulis di pesan ini.",
      status: "selesai",
      createdAt: now - 50 * H,
    },
    {
      id: "TK-8818",
      name: "Laras W.",
      contact: "laras@mail.com",
      category: "Pembayaran",
      priority: "urgent",
      subject: "Refund belum masuk 7 hari",
      message:
        "Refund Rp1.200.000 dijanjikan 3-5 hari kerja. Sudah 7 hari belum masuk rekening.",
      status: "selesai",
      createdAt: now - 80 * H,
    },
  ];
}

export function loadTickets() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* abaikan */
  }
  const seeded = seedTickets();
  saveTickets(seeded);
  return seeded;
}

export function saveTickets(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* abaikan */
  }
}

export function createTicket(data) {
  const ticket = {
    id: "TK-" + Math.floor(1000 + Math.random() * 9000),
    ...data,
    status: "baru",
    createdAt: Date.now(),
  };
  const next = [ticket, ...loadTickets()];
  saveTickets(next);
  return { ticket, next };
}

export function moveTicket(id, dir) {
  const next = loadTickets().map((t) => {
    if (t.id !== id) return t;
    const idx = STATUSES.indexOf(t.status);
    const ni = Math.min(STATUSES.length - 1, Math.max(0, idx + dir));
    return { ...t, status: STATUSES[ni] };
  });
  saveTickets(next);
  return next;
}

export function resetTickets() {
  const seeded = seedTickets();
  saveTickets(seeded);
  return seeded;
}
