export type Project = {
	id: string;
	title: string;
	tagline: string;
	description: string;
	problem: string;
	solution: string;
	impact: string;
	role: string;
	stack: string[];
	year: number;
	category: 'Web' | 'Security' | 'Mobile' | 'Systems';
	highlight?: string;
	link?: string;
	github: string;
};

export type SkillGroup = {
	category: string;
	description: string;
	items: { name: string; tag: string }[];
};

export type TimelineItem = {
	period: string;
	role: string;
	institution: string;
	description: string;
};

export type Achievement = {
	title: string;
	issuer: string;
	year: string;
	badge: string;
	description: string;
};

export const profile = {
	name: 'Ravidya Satrio Adi',
	shortName: 'Ravidya',
	role: 'Software Engineer & Web Security Researcher',
	headline: 'Full-Stack Developer & Siswa PPLG di SMK Negeri 8 Semarang',
	school: 'SMK Negeri 8 Semarang',
	major: 'PPLG (Pengembangan Perangkat Lunak & Gim)',
	class: 'XI PPLG 2',
	nisn: '0107348182',
	birthplace: 'Pati, 21 Maret 2010',
	location: 'Semarang, Jawa Tengah',
	bio: 'Siswa SMK Negeri 8 Semarang jurusan PPLG yang berdedikasi membangun aplikasi web modern, arsitektur perangkat lunak yang teruji, dan eksplorasi keamanan sistem. Memiliki rekam jejak dalam pengembangan frontend reaktif (SvelteKit, TypeScript), mobile development (Kotlin), serta riset keamanan siber (CTF & OWASP).',
	github: 'https://github.com/Rapyas-kece',
	email: 'ravidya.satrioadi@email.com',
	phone: '+62 812-3456-7890',
	availability: 'Terbuka untuk program magang industri (PKL 2026) & proyek kolaborasi perangkat lunak'
};

export const projects: Project[] = [
	{
		id: 'absensi-lab',
		title: 'Sistem Presensi & Manajemen Lab PPLG',
		tagline: 'Sistem digital presensi siswa berbasis QR token terenkripsi real-time',
		description: 'Aplikasi web menyeluruh untuk memfasilitasi pencatatan kehadiran siswa di laboratorium komputer jurusan PPLG SMK Negeri 8 Semarang dengan keamanan token anti-kecurangan.',
		problem: 'Pencatatan manual berbasis kertas memakan waktu 10-15 menit per sesi, rentan manipulasi tanda tangan, dan rekapitulasi nilai kehadiran bulanan lambat.',
		solution: 'Membangun aplikasi web dengan arsitektur SvelteKit yang menghasilkan QR Code dinamis berbasis waktu (TOTP) dengan validasi fingerprint per perangkat.',
		impact: 'Memangkas waktu pencatatan dari 15 menit menjadi < 3 detik per siswa; 99.9% uptime dengan 120+ entri harian di lab sekolah.',
		role: 'Lead Full-Stack Developer & System Architect',
		stack: ['SvelteKit 3', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Crypto API'],
		year: 2026,
		category: 'Web',
		highlight: 'Digunakan aktif harian di Lab PPLG SMK N 8 Semarang',
		github: 'https://github.com/Rapyas-kece'
	},
	{
		id: 'cybersec-labs',
		title: 'Cybersecurity Toolkit & Writeup Lab CTF',
		tagline: 'Tooling audit keamanan web mandiri & repositori pemecahan tantangan CTF',
		description: 'Kumpulan perkakas otomasi audit pengujian penetrasi (fuzzing kerentanan OWASP Top 10) serta dokumentasi sistematis writeup kompetisi Capture The Flag.',
		problem: 'Tantangan CTF dan audit web membutuhkan pengujian berulang terhadap injeksi SQL, XSS payload, dan bypass filter yang lambat jika dilakukan manual.',
		solution: 'Mengembangkan skrip otomasi Python dan Bash untuk pemindaian parameter endpoint, decoding hash multi-layer, serta analisis lalu lintas paket Wireshark.',
		impact: 'Berhasil memecahkan 40+ skenario CTF kategori Web Exploitation, Reverse Engineering, dan Cryptography.',
		role: 'Security Researcher & Script Developer',
		stack: ['Python', 'Bash', 'Linux Environment', 'Wireshark', 'OWASP ZAP'],
		year: 2026,
		category: 'Security',
		highlight: '40+ Skenario CTF & Lab mandiri terpecahkan',
		github: 'https://github.com/Rapyas-kece'
	},
	{
		id: 'pjbl-mobile',
		title: 'PJBL Mobile Task Architecture App',
		tagline: 'Aplikasi Android native untuk manajemen proyek siswa berbasis MVVM',
		description: 'Aplikasi Android modern yang dirancang untuk mengelola tenggat waktu, pembagian tugas kelompok, dan pemantauan progres pengerjaan proyek siswa SMK.',
		problem: 'Koordinasi tugas kelompok PJBL sering tidak terpantau dengan baik dan kehilangan data saat koneksi internet sekolah tidak stabil.',
		solution: 'Mengimplementasikan arsitektur MVVM (Model-View-ViewModel) dengan Room Database lokal yang memiliki sinkronisasi data background saat online.',
		impact: 'Performa rendering 60 FPS menggunakan Jetpack Compose, konsumsi memori hemat, dan persistensi data 100% aman.',
		role: 'Android Native Developer',
		stack: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Room DB', 'Coroutines'],
		year: 2026,
		category: 'Mobile',
		highlight: 'Arsitektur MVVM terstandar industri',
		github: 'https://github.com/Rapyas-kece'
	},
	{
		id: 'vision-chord',
		title: 'Vision Chord & Audio Synthesizer Lab',
		tagline: 'Eksperimen sintesis audio dan visualisasi kanvas berlatensi rendah',
		description: 'Laboratorium interaktif berbasis web untuk memproses audio digital dan menyajikan visualisasi frekuensi real-time menggunakan Canvas API.',
		problem: 'Visualisasi gelombang audio di browser kerap mengalami frame drop dan latensi pemrosesan di atas 50ms pada perangkat spesifikasi menengah.',
		solution: 'Memanfaatkan Web Audio API dengan buffer non-blocking dan rendering kanvas berbasis requestAnimationFrame yang teroptimasi.',
		impact: 'Mencapai latensi pemrosesan audio sub-15ms dengan stabilitas rendering gelombang 60 FPS tanpa lag.',
		role: 'Frontend & Creative Technologist',
		stack: ['TypeScript', 'Web Audio API', 'Canvas API', 'Tailwind CSS'],
		year: 2026,
		category: 'Web',
		highlight: 'Sub-15ms audio latency pada rendering kanvas',
		github: 'https://github.com/Rapyas-kece'
	}
];

export const skillGroups: SkillGroup[] = [
	{
		category: 'Frontend & UI Architecture',
		description: 'Membangun antarmuka web modern yang cepat, reaktif, dan berstandar industri.',
		items: [
			{ name: 'Svelte 5 & SvelteKit', tag: 'Framework Utama' },
			{ name: 'TypeScript', tag: 'Bahasa Pemrograman' },
			{ name: 'Tailwind CSS v4', tag: 'Styling & Design System' },
			{ name: 'Responsive Web Design', tag: 'Standar UX/UI' },
			{ name: 'Web Audio & Canvas API', tag: 'Multimedia Interaktif' },
			{ name: 'State Management & Runes', tag: 'Arsitektur' }
		]
	},
	{
		category: 'Cybersecurity & Systems',
		description: 'Pengujian penetrasi beretika, analisis keamanan aplikasi web, dan otomasi sistem.',
		items: [
			{ name: 'Web Exploitation (OWASP Top 10)', tag: 'Keamanan Web' },
			{ name: 'Capture The Flag (CTF)', tag: 'Analisis Tantangan' },
			{ name: 'Linux / Bash Scripting', tag: 'Sistem Operasi' },
			{ name: 'Wireshark & Nmap', tag: 'Analisis Jaringan' },
			{ name: 'Security Hardening', tag: 'Pertahanan Sistem' }
		]
	},
	{
		category: 'Mobile, Backend & Tooling',
		description: 'Pengembangan aplikasi mobile native, pengelolaan database, dan alur kerja pengembangan modern.',
		items: [
			{ name: 'Kotlin & Android SDK', tag: 'Pengembangan Mobile' },
			{ name: 'Jetpack Compose & MVVM', tag: 'Arsitektur Mobile' },
			{ name: 'Git & GitHub Ops', tag: 'Kontrol Versi' },
			{ name: 'RESTful APIs & SQLite', tag: 'Basis Data' },
			{ name: 'Vite & Bun Engine', tag: 'Build Tooling' }
		]
	}
];

export const achievements: Achievement[] = [
	{
		title: 'Siswa Jurusan PPLG Berprestasi',
		issuer: 'SMK Negeri 8 Semarang',
		year: '2025 — 2026',
		badge: 'Akademik & Kejuruan',
		description: 'Konsisten berkontribusi dalam pengembangan aplikasi sistem sekolah dan proyek unggulan laboratorium PPLG.'
	},
	{
		title: 'Finalis & Peserta Aktif Kompetisi CTF',
		issuer: 'Komunitas Keamanan Siber Indonesia',
		year: '2025 — 2026',
		badge: 'Cybersecurity',
		description: 'Berhasil memecahkan 40+ tantangan Capture The Flag lintas kategori Web Exploitation, Reverse Engineering, dan Forensik Jaringan.'
	},
	{
		title: 'Peserta Terpilih Workshop OOTS 2026',
		issuer: 'Program Portofolio Modern SMK',
		year: '2026',
		badge: 'Web Engineering',
		description: 'Membangun portofolio web modern bertahap dengan SvelteKit, TypeScript, Tailwind CSS v4, dan prinsip desain antarmuka mutakhir.'
	}
];

export const timeline: TimelineItem[] = [
	{
		period: '2024 — Sekarang',
		role: 'Siswa Jurusan PPLG (XI PPLG 2)',
		institution: 'SMK Negeri 8 Semarang',
		description: 'Mendalami pengembangan perangkat lunak dan gim (PPLG), algoritma pemrograman, pengembangan aplikasi mobile (Android), serta arsitektur sistem informasi sekolah.'
	},
	{
		period: '2026',
		role: 'Pengembang Utama Proyek Lab PPLG',
		institution: 'Laboratorium Komputer SMKN 8 Semarang',
		description: 'Merancang dan menerapkan Sistem Presensi Lab PPLG berbasis QR token dinamis yang digunakan secara harian oleh 120+ siswa.'
	},
	{
		period: '2025 — 2026',
		role: 'Riset Mandiri Keamanan Web & CTF',
		institution: 'Independent Research',
		description: 'Eksplorasi tantangan keamanan web, writeup eksploitasi beretika, dan pengembangan otomasi pengujian kerentanan berbasis Python.'
	}
];
