# Project Context & Model Memory

## Status Aktif
- **Repository**: `https://github.com/Rapyas-kece/oots`
- **Lokasi Lokal**: `D:\oots`
- **Tema Desain**: Modern Engineering Craft (Inspirasi Linear, Stripe, Vercel) — color harmony formula (60-30-10 + Triadic Analogue OKLCH/WCAG AAA: Deep Obsidian Slate `#07080d`, Royal Electric Indigo `#6366f1`, Luminous Cyan `#06b6d4`, dan Security Emerald `#10b981`), tipografi Plus Jakarta Sans & JetBrains Mono, layout bento grid editorial.
- **Komponen Utama**:
  - `Card3D.svelte`: Kartu Pelajar SMK Negeri 8 Semarang 3D interaktif yang digantung tali lanyard fisik dinamis (Bézier SVG physics-attached). Penjepit carabiner logam menyatu langsung dengan lubang kartu di ruang 3D (`transform-origin: top center`), mendukung ayunan pegas pendulum alami, rotasi 360°, efek tilt hover kursor, dan flip depan/belakang tanpa bug desinkronisasi.
  - `TerminalPrompt.svelte`: Konsol pengembang minimalis terintegrasi bergaya Unix/macOS dengan pintasan perintah instan.
  - Showcase Proyek: Kartu proyek bento-style dengan interactive cursor spotlight glow, filter kategori (Web, Security, Mobile), tag teknologi, dan tautan GitHub.
  - Matriks Keahlian: Pengelompokan kapabilitas teknis yang jujur & profesional (tanpa bar persentase buatan).
  - Riwayat Pendidikan: Timeline SMK Negeri 8 Semarang (PPLG) dan pembelajaran teknis.

## Log Keputusan & Riwayat Aktivitas
- **2026-11-18**: Inisialisasi cloning repositori `oots` dari GitHub ke `C:\Users\ravid\.gemini\antigravity\scratch\oots`.
- **2026-11-18**: Folder proyek dipindahkan dari C ke D (`D:\oots`) atas permintaan pengguna.
- **2026-11-18**: Penyesuaian skrip `package.json` menggunakan flag `bun --bun` untuk mengeksekusi Vite & SvelteKit langsung menggunakan engine Bun tanpa dependensi shim binary `node.exe` di Windows. Verifikasi build dan svelte-check 100% sukses (0 errors, 0 warnings).
- **2026-11-18**: Refactoring total UI/UX dari tema klise AI hacker ke standar portofolio engineer top di GitHub. Memperbaiki bug tali lanyard identitas secara fundamental dengan arsitektur SVG Bézier dinamis dan carabiner 3D yang terkunci pada lubang kartu.
- **2026-11-18**: Penyempurnaan layout, pengalihan tipografi ke Plus Jakarta Sans & JetBrains Mono, implementasi banner kredibilitas lab/CTF, dan penguncian origin rotasi gantungan 3D (`top center`) untuk zero desynchronization.
- **2026-11-18**: Formulasi matematis palet warna baru berdasarkan teori warna 60-30-10, Triadic Harmony HSL/OKLCH, dan kepatuhan kontras WCAG 2.2 AAA (17.2:1). Mengganti warna dasar menjadi Deep Obsidian Slate (`#07080d`), Royal Electric Indigo (`#6366f1`), dan Luminous Cyan (`#06b6d4`), selaras dengan identitas siswa PPLG SMK N 8 Semarang.
- **2026-11-18**: Rekonstruksi arsitektur portofolio penuh (Syarat Wajib Portofolio Industri):
  1. Transformasi showcase proyek menjadi *Engineering Case Studies* terstruktur (`Problem` -> `Solution` -> `Impact` -> `Role`).
  2. Implementasi modal CV/Resume interaktif (`src/lib/components/ResumeModal.svelte`) dengan fitur cetak/PDF langsung.
  3. Pembuatan formulir kontak fungsional terverifikasi (`src/lib/components/ContactForm.svelte`) dengan status interaktif dan tombol email instan.
  4. Penyempurnaan metadata data teknis (`src/lib/data.ts`) dan kepatuhan aksesibilitas ARIA.
  5. Verifikasi mandiri: `bun run check` (0 error, 0 warning) dan `bun run build` sukses 100%.
- **2026-11-18**: Implementasi animasi masuk tipografi/font saat scroll ke atas dan ke bawah:
  1. Dibuat Svelte Action reaktif [src/lib/actions/reveal.ts](file:///d:/oots/src/lib/actions/reveal.ts) berbasis `IntersectionObserver` bi-direksional (`once: false`).
  2. Dikonfigurasi kurva bezier pegas halus `cubic-bezier(0.16, 1, 0.3, 1)` dengan efek letter-spacing expansion, vertical glide, dan blur-to-focus di [src/routes/layout.css](file:///d:/oots/src/routes/layout.css).
  3. Diterapkan `use:reveal` terhuyung (*staggered*) pada seluruh heading judul, teks deskripsi, kartu bento studi kasus, dan badge di [src/routes/+page.svelte](file:///d:/oots/src/routes/+page.svelte).
  4. Verifikasi mandiri: `svelte-check` 0 error, build produksi sukses dalam 741ms.
- **2026-11-18**: Refactoring background visual bertingkat (Multi-layered Atmospheric System):
  1. Mengganti latar belakang monoton menjadi canvas radial twilight (`.bg-radial-canvas`) dengan kedalaman vertikal `#161a38` -> `#0c0f20` -> `#070810` -> `#040509`.
  2. Menambahkan tekstur arsitektural teknis (`.bg-tech-grid`) 56px dengan top-center radial vignette mask.
  3. Memasang 4 orbs living aurora dinamis yang berayun halus (`aurora-orb-1`, `aurora-orb-2`, `aurora-orb-3`, dan bottom contact horizon aurora) mewakili triadic palette: Electric Indigo, Luminous Cyan, Security Emerald, dan Royal Violet.
  4. Memberikan pembatas horizon berpendar gradien (*glowing horizon dividers*) pada setiap section.
  5. Verifikasi mandiri: `svelte-check` 0 error, build produksi sukses 100%.
- **2026-11-18**: Overhaul total tipografi (Eye-comfort Typography System):
  1. Mengganti font primer menjadi **Manrope** (Google Fonts: geometric neo-grotesque yang sangat halus, elegan, dan nyaman di mata untuk dark mode).
  2. Mengganti font monospace kode menjadi **Geist Mono** (minimalis, ramping, tanpa distorsi visual).
  3. Menghapus *mono fatigue*: mengganti penggunaan berlebih `font-mono` pada navbar, tombol CTA, judul section, badge, dan label kartu menjadi `font-sans font-semibold tracking-wide` yang nyaman dibaca.
  4. Menyelaraskan teks kartu pelajar 3D di [src/lib/components/Card3D.svelte](file:///d:/oots/src/lib/components/Card3D.svelte) menjadi sans-serif resmi berstandar kartu identitas profesional.
  5. Verifikasi mandiri: `svelte-check` 0 error, build produksi sukses dalam 898ms.
- **2026-11-18**: Sinkronisasi seluruh terminologi jurusan dari 'RPL' ke 'PPLG' (Pengembangan Perangkat Lunak dan Gim):
  1. Diperbarui judul proyek dan studi kasus di [src/lib/data.ts](file:///d:/oots/src/lib/data.ts) ('Sistem Presensi & Manajemen Lab PPLG', peran, deskripsi pencapaian, dan riwayat).
  2. Diperbarui telemetry status banner dan generator kode token real-time di [src/routes/+page.svelte](file:///d:/oots/src/routes/+page.svelte) (`qrToken` menjadi `PPLG-XXXX`).
  3. Diperbarui label kartu identitas pelajar 3D di [src/lib/components/Card3D.svelte](file:///d:/oots/src/lib/components/Card3D.svelte).
  4. Verifikasi mandiri: `svelte-check` 0 error, build produksi sukses dalam 934ms.
- **2026-11-19**: Comprehensive Audit & Overhaul Kualitas Front-End Juara 1:
  1. **Tipografi & Font**: Mengeliminasi *mono fatigue* pada formulir kontak ([src/lib/components/ContactForm.svelte](file:///d:/oots/src/lib/components/ContactForm.svelte)), modal CV/Resume ([src/lib/components/ResumeModal.svelte](file:///d:/oots/src/lib/components/ResumeModal.svelte)), dan Command Palette ([src/lib/components/CommandPalette.svelte](file:///d:/oots/src/lib/components/CommandPalette.svelte)). Semua label, tombol, teks input, dan heading kini menggunakan font Manrope sans-serif yang nyaman di mata. Monospace (`Geist Mono`) hanya direservasi untuk token, NISN, code, dan tech stack.
  2. **Mobile Navigation Menu**: Menambahkan tombol hamburger responsif dan overlay drawer menu di [src/routes/+page.svelte](file:///d:/oots/src/routes/+page.svelte) sehingga navigasi di layar smartphone 100% mulus saat dinilai juri lomba.
  3. **Desain & Micro-interactions**: Memperbaiki bug link `#proyek` -> `#studi-kasus` dan mengganti `alert()` browser dengan status toast di Command Palette; menyempurnakan kartu studi kasus dengan aksen garis kiri & dot pill untuk Tantangan (Rose), Solusi (Cyan), dan Dampak (Emerald).
  4. **Print Optimization**: Menambahkan styling CSS `@media print` khusus pada CV viewer agar menghasilkan lembar resume A4 putih bersih dan rapi saat diekspor ke PDF / dicetak.
  5. **Warna & Kerapian Visual**: Menyelaraskan seleksi teks (`::selection`), mendesain scrollbar tipis modern, dan menambahkan garis timeline berkilau (*spine timeline*) pada riwayat pendidikan.
  6. **Verifikasi Mandiri**: `bun run check` (0 error, 0 warning) dan `bun run build` sukses 100% (937ms).
- **2026-11-19**: Upgrade Total 3D Spatial Computing & Animasi Spektakuler Juara 1:
  1. **Interactive 3D Engine Handcrafted ([src/lib/components/CyberCore3D.svelte](file:///d:/oots/src/lib/components/CyberCore3D.svelte))**: Diciptakan modul laboratorium 3D murni matematis kanvas 60 FPS (zero external package bloat). Menghadirkan proyeksi matriks 3D rotasi ruang xyz untuk Icosahedron, Quantum Torus Knot, dan Geodesic Sphere, lengkap dengan 140 partikel spasial ambient, kontrol drag rotasi interaktif ber-inersia, shockwave pulse, dan indikator telemetri real-time.
  2. **Kartu Pelajar 3D Multi-Layer Parallax ([src/lib/components/Card3D.svelte](file:///d:/oots/src/lib/components/Card3D.svelte))**: Ditingkatkan menjadi stereoscopic 3D penuh. Foto pelajar, microchip emas, nama siswa, dan segel hologram kini mengambang di ruang 3D dengan `translateZ` bertingkat (14px - 36px) serta kilauan lapisan foil holografis (*prismatic iridescent sheen*) yang bergeser dinamis mengikuti sudut rotasi kartu.
  3. **Svelte Action 3D Interactive Card Tilt ([src/lib/actions/tilt.ts](file:///d:/oots/src/lib/actions/tilt.ts))**: Menerapkan efek tilt 3D kursor ala Apple/Stripe dengan pantulan cahaya glare dinamis pada seluruh kartu studi kasus, pencapaian lomba, dan keahlian teknis.
  4. **Kinetic Animated Hero Headline ([src/routes/+page.svelte](file:///d:/oots/src/routes/+page.svelte))**: Siklus teks dinamis beranimasi halus pada badge hero ('Siswa PPLG SMK Negeri 8 Semarang' -> 'Full-Stack Developer' -> 'Web Security & CTF Lab Researcher' -> 'High-Performance UI/UX Engineer').
  5. **Verifikasi Mandiri**: `bun run check` (0 error, 0 warning) dan `bun run build` sukses 100% (866ms).
