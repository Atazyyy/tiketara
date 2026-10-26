# Tiketara — Sistem Tiket Bantuan (Helpdesk)

> **Kategori proyek: Web App — Ticketing / Helpdesk System.**
> Pelanggan buat tiket, agen proses di papan kanban: Baru → Diproses → Selesai — dengan SLA per prioritas.

Helpdesk ringan untuk bisnis kecil yang butuh pelanggan "tercatat dan tidak
hilang" tanpa fitur enterprise yang bikin pusing. Proyek ini adalah
**concept demo** untuk portofolio jasa pembuatan web — seluruh pelanggan dan
tiket bersifat fiktif. Nama "Tiketara" sengaja dibuat unik (belum dipakai
entitas mana pun di internet).

**Live:** https://tiketara.vercel.app

## Fitur

- **Papan Agent** berbentuk kanban 3 kolom (Tiket Baru / Diproses / Selesai)
  dengan tombol maju-mundur per tiket.
- **SLA otomatis**: Urgent 4 jam, Tinggi 8 jam, Normal 24 jam — tiket yang
  melewati batas langsung ditandai merah.
- Kartu tiket bisa diklik untuk melihat detail pesan pelanggan.
- **Form pelanggan** dengan validasi: tiket baru langsung mendapat nomor
  (TK-XXXX) dan muncul di papan agent.
- Stat ringkas: tiket terbuka, urgent aktif, total.
- Tombol reset data demo. Semua data tersimpan di **localStorage**.

## Kenapa "ringan"?

Demo ini sengaja dibuat sebagai contoh aplikasi **hemat**: tanpa foto,
tanpa library animasi, satu halaman, dua tab — cocok untuk internal tools
yang harus cepat dibuka setiap hari. Bundel produksinya kecil dan langsung
bisa dipakai tim.

## Untuk siapa demo ini?

Toko online, jasa service, klinik, agensi — semua tim yang menerima keluhan
dan ingin tiap keluhan punya nomor, status, dan tenggat.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Lucide Icons
- (Sengaja tanpa library animasi — versi ringan)

## Menjalankan

```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # build produksi ke folder dist/
```

## Catatan

- Seluruh tiket adalah data contoh (seed) yang disimpan di localStorage
  browser — tidak ada backend sungguhan.
- Dibuat sebagai concept demo portofolio oleh
  [Agni Miftah Fauzi](https://github.com/Atazyyy).
