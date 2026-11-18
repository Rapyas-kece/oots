<script lang="ts">
	import { onMount } from 'svelte';
	import Card3D from '$lib/components/Card3D.svelte';
	import CyberCore3D from '$lib/components/CyberCore3D.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import TerminalPrompt from '$lib/components/TerminalPrompt.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import ResumeModal from '$lib/components/ResumeModal.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { tilt } from '$lib/actions/tilt';
	import { profile, projects, skillGroups, achievements, timeline } from '$lib/data';

	let activeFilter = $state<string>('ALL');
	let copiedEmail = $state(false);
	let isCommandOpen = $state(false);
	let isResumeOpen = $state(false);
	let isMobileMenuOpen = $state(false);
	let localTime = $state('23:00:00 WIB');

	// Kinetic Role Cycler
	const kineticRoles = [
		'Siswa PPLG SMK Negeri 8 Semarang',
		'Full-Stack Developer (SvelteKit & TypeScript)',
		'Web Security & CTF Lab Researcher',
		'High-Performance UI/UX Engineer'
	];
	let roleIndex = $state(0);
	let displayedRole = $state(kineticRoles[0]);

	// Interactive Demo States
	let audioPlaying = $state(false);
	let audioCanvas: HTMLCanvasElement | undefined = $state();
	let ctfSimulating = $state(false);
	let ctfOutput = $state('0x9a8f... [SIAP AUDIT]');
	let qrToken = $state('PPLG-8824');
	let qrTimer = $state(5);

	let filteredProjects = $derived(
		activeFilter === 'ALL'
			? projects
			: projects.filter((p) => p.category.toUpperCase() === activeFilter.toUpperCase())
	);

	function copyEmail() {
		navigator.clipboard.writeText(profile.email);
		copiedEmail = true;
		setTimeout(() => {
			copiedEmail = false;
		}, 2000);
	}

	function handleCardMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		target.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		target.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	}

	// Interactive Demo: Web Audio API Synthesizer (Vision Chord)
	function playSynthDemo() {
		if (audioPlaying) return;
		audioPlaying = true;

		try {
			const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			const ctx = new AudioContextClass();
			const notes = [261.63, 329.63, 392.0, 493.88];

			notes.forEach((freq, idx) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'sine';
				osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

				gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.15);
				gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + idx * 0.15 + 0.05);
				gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 1.2);

				osc.connect(gain);
				gain.connect(ctx.destination);

				osc.start(ctx.currentTime + idx * 0.15);
				osc.stop(ctx.currentTime + idx * 0.15 + 1.25);
			});

			if (audioCanvas) {
				const cvs = audioCanvas;
				const c = cvs.getContext('2d');
				if (c) {
					let frame = 0;
					const drawWave = () => {
						if (!audioPlaying && frame > 40) return;
						c.clearRect(0, 0, cvs.width, cvs.height);
						c.beginPath();
						c.strokeStyle = '#38bdf8';
						c.lineWidth = 2;
						for (let x = 0; x < cvs.width; x++) {
							const y = cvs.height / 2 + Math.sin(x * 0.08 + frame * 0.2) * 10 * Math.max(0, 1 - frame / 50);
							if (x === 0) c.moveTo(x, y);
							else c.lineTo(x, y);
						}
						c.stroke();
						frame++;
						if (frame < 50) requestAnimationFrame(drawWave);
					};
					drawWave();
				}
			}

			setTimeout(() => {
				audioPlaying = false;
				ctx.close();
			}, 1500);
		} catch {
			audioPlaying = false;
		}
	}

	// Interactive Demo: CTF Hash Decoder (Cybersecurity Toolkit)
	function runCtfDemo() {
		if (ctfSimulating) return;
		ctfSimulating = true;
		const targetStr = 'FLAG{SMKN8_PPLG_SEC}';
		const chars = 'ABCDEF0123456789!@#$%^&*';
		let iteration = 0;

		const interval = setInterval(() => {
			let current = '';
			for (let i = 0; i < targetStr.length; i++) {
				if (i < Math.floor(iteration / 2)) {
					current += targetStr[i];
				} else {
					current += chars[Math.floor(Math.random() * chars.length)];
				}
			}
			ctfOutput = current;
			iteration++;

			if (iteration > targetStr.length * 2) {
				clearInterval(interval);
				ctfOutput = 'MATCH: ' + targetStr;
				setTimeout(() => {
					ctfSimulating = false;
				}, 2500);
			}
		}, 45);
	}

	onMount(() => {
		const updateClock = () => {
			const now = new Date();
			localTime = now.toLocaleTimeString('id-ID', {
				timeZone: 'Asia/Jakarta',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			}) + ' WIB';
		};
		updateClock();
		const clockTimer = setInterval(updateClock, 1000);

		const tokenTimer = setInterval(() => {
			qrTimer--;
			if (qrTimer <= 0) {
				qrTimer = 5;
				qrToken = 'PPLG-' + Math.floor(1000 + Math.random() * 9000);
			}
		}, 1000);

		const roleTimer = setInterval(() => {
			roleIndex = (roleIndex + 1) % kineticRoles.length;
			displayedRole = kineticRoles[roleIndex];
		}, 3000);

		return () => {
			clearInterval(clockTimer);
			clearInterval(tokenTimer);
			clearInterval(roleTimer);
		};
	});
</script>

<!-- Command Palette Modal (Ctrl+K) -->
<CommandPalette bind:isOpen={isCommandOpen} />

<!-- Full Curriculum Vitae / Resume Viewer Modal -->
<ResumeModal bind:isOpen={isResumeOpen} />

<div class="relative min-h-dvh bg-radial-canvas text-slate-100 selection:bg-indigo-500 selection:text-white overflow-hidden">
	<!-- Multi-layered Ambient Atmosphere & Dynamic Aurora Gradients -->
	<!-- 1. Architectural Technical Grid -->
	<div class="pointer-events-none fixed inset-0 -z-10 bg-tech-grid opacity-75"></div>

	<!-- 2. Dynamic Floating Aurora Orbs -->
	<!-- Top Center Hero Aurora: Royal Electric Indigo & Deep Violet -->
	<div class="pointer-events-none fixed top-0 left-1/2 -z-10 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-600/25 via-violet-600/18 to-cyan-500/12 blur-[140px] aurora-orb-1"></div>

	<!-- Mid-Left Case Studies Aurora: Luminous Cyan & Sky Blue -->
	<div class="pointer-events-none fixed top-1/3 -left-48 -z-10 h-[650px] w-[700px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-sky-600/12 to-indigo-500/10 blur-[150px] aurora-orb-2"></div>

	<!-- Mid-Right Achievements & Security Aurora: Emerald & Teal Aura -->
	<div class="pointer-events-none fixed top-2/3 -right-40 -z-10 h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-emerald-500/12 via-teal-600/10 to-indigo-600/12 blur-[150px] aurora-orb-3"></div>

	<!-- Bottom Contact Horizon Aurora: Electric Indigo & Royal Purple Horizon -->
	<div class="pointer-events-none fixed bottom-0 left-1/2 -z-10 h-[500px] w-[1200px] -translate-x-1/2 translate-y-1/4 rounded-full bg-gradient-to-t from-indigo-600/20 via-purple-600/15 to-transparent blur-[160px]"></div>

	<!-- Floating Blurred Capsule Header -->
	<div class="sticky top-4 z-50 px-4 sm:px-6">
		<header class="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#0d1018]/85 px-5 backdrop-blur-xl shadow-lg shadow-black/60">
			<!-- Monogram / Brand -->
			<a href="/" class="flex items-center gap-2.5 font-sans text-sm font-bold tracking-tight text-white transition hover:text-indigo-400">
				<span class="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs font-bold shadow-sm">
					R
				</span>
				<span>ravidya<span class="text-indigo-400">.dev</span></span>
			</a>

			<!-- Center Navigation Links -->
			<nav class="hidden items-center gap-7 font-sans text-xs font-semibold tracking-wide text-zinc-400 md:flex">
				<a href="#tentang" class="transition hover:text-white">Tentang</a>
				<a href="#studi-kasus" class="transition hover:text-white">Studi Kasus</a>
				<a href="#spatial-3d" class="transition hover:text-cyan font-bold text-indigo-400 flex items-center gap-1">
					<span class="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse"></span>
					<span>Lab 3D</span>
				</a>
				<a href="#keahlian" class="transition hover:text-white">Keahlian</a>
				<a href="#prestasi" class="transition hover:text-white">Pencapaian</a>
				<a href="#riwayat" class="transition hover:text-white">Riwayat</a>
				<a href="#kontak" class="transition hover:text-white">Kontak</a>
			</nav>

			<!-- Action Hub -->
			<div class="flex items-center gap-2">
				<!-- Command Palette Trigger -->
				<button
					type="button"
					onclick={() => (isCommandOpen = true)}
					class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-sans text-[11px] font-medium text-zinc-400 hover:text-white hover:border-white/20 transition shadow-sm"
					title="Buka Command Palette (Ctrl+K)"
				>
					<span class="text-xs">⌘</span>
					<span class="hidden sm:inline font-mono">K</span>
				</button>

				<!-- Resume / CV Viewer Trigger -->
				<button
					type="button"
					onclick={() => (isResumeOpen = true)}
					class="hidden sm:flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 font-sans text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
				>
					<span>CV / Resume</span>
					<span>📄</span>
				</button>

				<a
					href="#kontak"
					class="hidden xs:flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-1 font-sans text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-95 shadow-sm shadow-indigo-600/30"
				>
					Kontak
				</a>

				<!-- Mobile Hamburger Toggle -->
				<button
					type="button"
					onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
					class="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 md:hidden hover:text-white hover:bg-white/10 transition"
					aria-label="Toggle navigation menu"
					aria-expanded={isMobileMenuOpen}
				>
					{#if isMobileMenuOpen}
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<line x1="18" y1="6" x2="6" y2="18"/>
							<line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					{:else}
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<line x1="3" y1="12" x2="21" y2="12"/>
							<line x1="3" y1="6" x2="21" y2="6"/>
							<line x1="3" y1="18" x2="21" y2="18"/>
						</svg>
					{/if}
				</button>
			</div>
		</header>

		<!-- Mobile Navigation Overlay Dropdown -->
		{#if isMobileMenuOpen}
			<div class="mt-2 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#0d1018]/95 p-4 backdrop-blur-2xl shadow-2xl md:hidden font-sans space-y-3">
				<div class="grid grid-cols-2 gap-2 text-xs font-semibold">
					<a
						href="#tentang"
						onclick={() => (isMobileMenuOpen = false)}
						class="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
					>
						<span class="text-indigo-400">●</span>
						<span>Tentang</span>
					</a>
					<a
						href="#studi-kasus"
						onclick={() => (isMobileMenuOpen = false)}
						class="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
					>
						<span class="text-cyan">●</span>
						<span>Studi Kasus</span>
					</a>
					<a
						href="#spatial-3d"
						onclick={() => (isMobileMenuOpen = false)}
						class="rounded-xl border border-cyan/30 bg-cyan/[0.06] p-3 text-cyan hover:text-white hover:bg-cyan/20 transition flex items-center gap-2 font-bold"
					>
						<span class="text-cyan animate-pulse">●</span>
						<span>Lab Grafika 3D</span>
					</a>
					<a
						href="#keahlian"
						onclick={() => (isMobileMenuOpen = false)}
						class="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
					>
						<span class="text-indigo-400">●</span>
						<span>Keahlian</span>
					</a>
					<a
						href="#prestasi"
						onclick={() => (isMobileMenuOpen = false)}
						class="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
					>
						<span class="text-emerald-400">●</span>
						<span>Pencapaian</span>
					</a>
					<a
						href="#riwayat"
						onclick={() => (isMobileMenuOpen = false)}
						class="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
					>
						<span class="text-violet-400">●</span>
						<span>Riwayat</span>
					</a>
					<a
						href="#kontak"
						onclick={() => (isMobileMenuOpen = false)}
						class="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
					>
						<span class="text-indigo-400">●</span>
						<span>Kontak</span>
					</a>
				</div>

				<div class="flex items-center gap-2 pt-2 border-t border-white/10">
					<button
						type="button"
						onclick={() => {
							isMobileMenuOpen = false;
							isResumeOpen = true;
						}}
						class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
					>
						<span>Lihat CV / Resume</span>
						<span>📄</span>
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- HERO SECTION: Genuine Identity & Authentic Value Proposition -->
	<section id="tentang" class="mx-auto max-w-6xl px-6 pt-12 pb-20 lg:pt-16 lg:pb-24">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
			<!-- Left Column: Biography & Value Proposition -->
			<div class="flex flex-col gap-6 lg:col-span-7">
				<!-- Status Badge -->
				<div
					use:reveal={{ type: 'badge', delay: 40 }}
					class="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-sans font-semibold tracking-wide text-indigo-300 shadow-sm"
				>
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
					</span>
					<span class="text-indigo-200 transition-all duration-300 font-medium">{displayedRole}</span>
				</div>

				<!-- Main Name & Subtitle -->
				<div class="flex flex-col gap-3">
					<h1
						use:reveal={{ type: 'heading', delay: 100 }}
						class="text-4xl font-extrabold tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl font-sans leading-[1.08]"
					>
						Ravidya <span class="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">Satrio Adi</span>
					</h1>
					<p
						use:reveal={{ type: 'text', delay: 180 }}
						class="text-lg font-medium text-zinc-300 sm:text-xl leading-relaxed font-sans"
					>
						Membangun solusi perangkat lunak web berkinerja tinggi, arsitektur modular, dan riset praktis <span class="text-indigo-400 font-semibold">Keamanan Siber</span>.
					</p>
				</div>

				<!-- Bio Narrative -->
				<p
					use:reveal={{ type: 'text', delay: 240 }}
					class="text-sm leading-relaxed text-zinc-400 sm:text-base max-w-xl font-sans"
				>
					{profile.bio}
				</p>

				<!-- Credentials & Academic Verification Chips -->
				<div
					use:reveal={{ type: 'card', delay: 300 }}
					class="grid grid-cols-2 gap-3 sm:grid-cols-3 font-sans text-xs"
				>
					<div class="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition hover:border-white/20">
						<span class="text-[10px] font-bold text-zinc-500 tracking-[0.12em] uppercase">KOMPETENSI</span>
						<div class="mt-1 font-bold text-sm text-zinc-200">PPLG SMK N 8</div>
					</div>
					<div class="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition hover:border-white/20">
						<span class="text-[10px] font-bold text-zinc-500 tracking-[0.12em] uppercase">NISN</span>
						<div class="mt-1 font-mono font-bold text-sm text-indigo-400">{profile.nisn}</div>
					</div>
					<div class="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition hover:border-white/20">
						<span class="text-[10px] font-bold text-zinc-500 tracking-[0.12em] uppercase">STATUS</span>
						<div class="mt-1 font-bold text-sm text-emerald-400">Siap Magang 2026</div>
					</div>
				</div>

				<!-- Primary Action Buttons -->
				<div
					use:reveal={{ type: 'card', delay: 360 }}
					class="flex flex-wrap items-center gap-3 pt-2 font-sans text-xs font-semibold"
				>
					<a
						href="#studi-kasus"
						class="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-white transition hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/30"
					>
						<span>Lihat Studi Kasus Proyek</span>
						<span>↓</span>
					</a>
					<button
						type="button"
						onclick={() => (isResumeOpen = true)}
						class="flex h-11 items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 text-indigo-200 transition hover:bg-indigo-500/20 active:scale-95"
					>
						<span>Unduh CV / Resume</span>
						<span>📄</span>
					</button>
					<button
						type="button"
						onclick={copyEmail}
						class="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-zinc-300 transition hover:border-white/20 hover:text-white active:scale-95"
					>
						<span>{copiedEmail ? 'Email Tersalin! ✓' : 'Salin Email'}</span>
						<span>✉</span>
					</button>
				</div>
			</div>

			<!-- Right Column: Interactive 3D Student ID Card as Proof of Identity -->
			<div
				use:reveal={{ type: 'card', delay: 200 }}
				class="flex flex-col items-center justify-center lg:col-span-5"
			>
				<Card3D />
			</div>
		</div>
	</section>

	<!-- CREDIBILITY & LIVE TELEMETRY BANNER -->
	<section
		use:reveal={{ type: 'badge', delay: 100 }}
		class="relative border-y border-white/[0.08] bg-gradient-to-r from-[#0b0e1b]/90 via-[#0e1326]/95 to-[#0b0e1b]/90 py-4.5 backdrop-blur-md"
	>
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
		<div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4 font-sans text-xs font-medium items-center">
				<div class="flex items-center gap-2">
					<span class="h-2 w-2 rounded-full bg-emerald-400"></span>
					<span class="text-zinc-300 font-medium">Presensi QR Lab PPLG</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="h-2 w-2 rounded-full bg-cyan"></span>
					<span class="text-zinc-300 font-medium">40+ Skenario CTF</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="h-2 w-2 rounded-full bg-indigo-400"></span>
					<span class="text-zinc-300 font-medium">Android MVVM Native</span>
				</div>
				<div class="flex items-center gap-2 text-zinc-300 font-medium">
					<span class="h-2 w-2 rounded-full bg-cyan animate-pulse"></span>
					<span class="font-mono text-xs">{localTime}</span>
				</div>
			</div>
		</div>
	</section>

	<!-- FEATURED CASE STUDIES / PROYEK REKAYASA (The Heart of a Portfolio) -->
	<section id="studi-kasus" class="relative py-20 lg:py-24">
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<!-- Section Header -->
			<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
				<div>
					<span
						use:reveal={{ type: 'badge', delay: 40 }}
						class="inline-block font-sans text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase"
					>
						Portofolio Rekayasa
					</span>
					<h2
						use:reveal={{ type: 'heading', delay: 100 }}
						class="mt-2 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl"
					>
						Studi Kasus Proyek Nyata
					</h2>
					<p
						use:reveal={{ type: 'text', delay: 160 }}
						class="mt-2 text-sm text-zinc-400 max-w-xl font-sans"
					>
						Setiap proyek dibangun untuk menyelesaikan permasalahan nyata dengan arsitektur kode teruji, bukan sekadar demo tiruan.
					</p>
				</div>

				<!-- Category Filters -->
				<div
					use:reveal={{ type: 'badge', delay: 180 }}
					class="flex flex-wrap gap-1.5 font-sans text-xs font-semibold rounded-full border border-white/10 bg-[#0d1018]/90 p-1"
				>
					{#each ['ALL', 'WEB', 'SECURITY', 'MOBILE'] as category}
						<button
							type="button"
							onclick={() => (activeFilter = category)}
							class="rounded-full px-3.5 py-1.5 transition {activeFilter === category ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30' : 'text-zinc-400 hover:text-zinc-200'}"
						>
							{category}
						</button>
					{/each}
				</div>
			</div>

			<!-- Case Studies Detailed Grid -->
			<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
				{#each filteredProjects as project, idx}
					<div
						use:reveal={{ type: 'card', delay: (idx % 2) * 120 + 60 }}
						use:tilt={{ max: 7, scale: 1.015, glare: true }}
						class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121622]/60 p-7 transition duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-black/70"
						onmousemove={handleCardMouseMove}
						role="article"
					>
						<!-- Interactive Spotlight Radial Glow -->
						<div
							class="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							style="background: radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.16), transparent 80%);"
						></div>

						<div class="relative z-10 space-y-4 font-sans">
							<!-- Header Meta -->
							<div class="flex items-center justify-between text-xs font-semibold">
								<span class="rounded bg-white/5 border border-white/10 px-2.5 py-0.5 text-zinc-300">
									0{idx + 1} · {project.category}
								</span>
								<span class="text-zinc-500 font-mono text-[11px]">{project.year}</span>
							</div>

							<!-- Title & Role -->
							<div>
								<h3 class="text-2xl font-bold tracking-tight text-white transition group-hover:text-indigo-400">
									{project.title}
								</h3>
								<div class="mt-1 flex items-center gap-2 text-xs text-indigo-400">
									<span class="font-medium text-zinc-400">Peran:</span>
									<span class="font-semibold text-zinc-200">{project.role}</span>
								</div>
								<p class="mt-1 text-xs text-zinc-400 italic">
									"{project.tagline}"
								</p>
							</div>

							<!-- Case Study Breakdown: Problem -> Solution -> Impact -->
							<div class="space-y-3 rounded-xl bg-black/40 p-4 border border-white/5 text-xs font-sans">
								<div>
									<div class="flex items-center gap-1.5 mb-1">
										<span class="inline-block h-1.5 w-1.5 rounded-full bg-rose-400"></span>
										<span class="text-[10px] font-bold text-rose-400 uppercase tracking-[0.1em]">
											Tantangan & Masalah
										</span>
									</div>
									<p class="text-zinc-300 leading-relaxed pl-2.5 border-l-2 border-rose-500/30">
										{project.problem}
									</p>
								</div>
								<div class="border-t border-white/5 pt-2.5">
									<div class="flex items-center gap-1.5 mb-1">
										<span class="inline-block h-1.5 w-1.5 rounded-full bg-cyan"></span>
										<span class="text-[10px] font-bold text-cyan uppercase tracking-[0.1em]">
											Solusi Rekayasa
										</span>
									</div>
									<p class="text-zinc-300 leading-relaxed pl-2.5 border-l-2 border-cyan/30">
										{project.solution}
									</p>
								</div>
								<div class="border-t border-white/5 pt-2.5">
									<div class="flex items-center gap-1.5 mb-1">
										<span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
										<span class="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.1em]">
											Dampak Nyata
										</span>
									</div>
									<p class="font-medium text-emerald-300 leading-relaxed pl-2.5 border-l-2 border-emerald-500/30">
										{project.impact}
									</p>
								</div>
							</div>

							<!-- Interactive Live Demo Widgets -->
							{#if project.id === 'vision-chord'}
								<div class="flex flex-col gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.04] p-3 font-sans text-xs">
									<div class="flex items-center justify-between">
										<span class="text-cyan font-bold text-xs tracking-wide">Interactive Audio Lab</span>
										<button
											type="button"
											onclick={playSynthDemo}
											class="flex items-center gap-1 rounded bg-cyan/20 px-2.5 py-1 text-cyan hover:bg-cyan/30 active:scale-95 transition text-xs font-semibold"
										>
											<span>{audioPlaying ? 'Memutar Akor...' : '▶ Uji Audio API'}</span>
										</button>
									</div>
									<canvas bind:this={audioCanvas} width="300" height="24" class="h-6 w-full rounded bg-black/40"></canvas>
								</div>
							{:else if project.id === 'cybersec-labs'}
								<div class="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-3 font-sans text-xs">
									<div class="flex items-center justify-between">
										<span class="text-indigo-400 font-bold text-xs tracking-wide">Live Hash Vector Solver</span>
										<button
											type="button"
											onclick={runCtfDemo}
											class="rounded bg-indigo-500/20 px-2.5 py-1 text-indigo-300 hover:bg-indigo-500/30 active:scale-95 transition text-xs font-semibold"
										>
											{ctfSimulating ? 'Mendekripsi...' : '⚡ Jalankan Dekripsi'}
										</button>
									</div>
									<div class="truncate text-zinc-300 bg-black/40 px-2 py-1 rounded font-mono text-[11px]">
										{ctfOutput}
									</div>
								</div>
							{:else if project.id === 'absensi-lab'}
								<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 font-sans text-xs">
									<div class="flex items-center gap-2">
										<span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
										<span class="text-zinc-200 font-mono font-semibold">{qrToken}</span>
									</div>
									<span class="text-zinc-500 text-[11px]">Rotasi token validasi: <strong class="font-mono text-zinc-400">{qrTimer}s</strong></span>
								</div>
							{/if}
						</div>

						<!-- Tech Stack & Source Link -->
						<div class="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-sans text-xs">
							<div class="flex flex-wrap gap-1.5">
								{#each project.stack as tech}
									<span class="rounded-md bg-white/5 border border-white/10 px-2.5 py-0.5 font-mono text-zinc-300 text-[11px]">
										{tech}
									</span>
								{/each}
							</div>

							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1 font-semibold text-zinc-300 transition hover:text-indigo-400"
							>
								<span>Source Code</span>
								<span class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 3D SPATIAL COMPUTING & INTERACTIVE GRAPHICS LAB -->
	<section id="spatial-3d" class="relative border-t border-white/[0.08] bg-gradient-to-b from-[#0a0d1e]/80 via-[#0d1025]/60 to-[#070a16]/80 py-20 lg:py-24 backdrop-blur-[2px]">
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
				<div>
					<span
						use:reveal={{ type: 'badge', delay: 40 }}
						class="inline-block font-sans text-xs font-bold text-cyan tracking-[0.2em] uppercase"
					>
						Spatial 3D & Graphics Engine
					</span>
					<h2
						use:reveal={{ type: 'heading', delay: 100 }}
						class="mt-2 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl"
					>
						Laboratorium Grafika 3D Interaktif
					</h2>
					<p
						use:reveal={{ type: 'text', delay: 160 }}
						class="mt-2 text-sm text-zinc-400 max-w-2xl font-sans"
					>
						Eksplorasi matematika proyeksi 3D real-time berbasis matriks transformasi kanvas tanpa dependensi eksternal (Zero NPM bloat, 60 FPS murni). Putar dengan mouse, ganti geometri polyhedral, dan picu gelombang kejut energi.
					</p>
				</div>
			</div>

			<div use:reveal={{ type: 'card', delay: 180 }}>
				<CyberCore3D />
			</div>
		</div>
	</section>

	<!-- ACHIEVEMENTS & CERTIFICATIONS SECTION (Mandatory Credibility Proof) -->
	<section id="prestasi" class="relative border-t border-white/[0.08] bg-gradient-to-b from-[#0a0d1d]/80 via-[#0d1229]/60 to-[#080b18]/80 py-20 lg:py-24 backdrop-blur-[2px]">
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<div>
				<span
					use:reveal={{ type: 'badge', delay: 40 }}
					class="inline-block font-sans text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase"
				>
					Bukti Kompetensi
				</span>
				<h2
					use:reveal={{ type: 'heading', delay: 100 }}
					class="mt-2 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl"
				>
					Pencapaian & Kredibilitas
				</h2>
				<p
					use:reveal={{ type: 'text', delay: 160 }}
					class="mt-2 text-sm text-zinc-400 max-w-xl font-sans"
				>
					Bukti nyata keaktifan, kompetisi keamanan siber, dan pengakuan akademik di SMK Negeri 8 Semarang.
				</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 font-sans">
				{#each achievements as item, idx}
					<div
						use:reveal={{ type: 'card', delay: idx * 90 }}
						use:tilt={{ max: 10, scale: 1.02, glare: true }}
						class="rounded-2xl border border-white/10 bg-[#121622]/60 p-6 flex flex-col justify-between transition duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20"
					>
						<div>
							<div class="flex items-center justify-between text-xs mb-3">
								<span class="rounded bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-indigo-300 text-[11px] font-semibold">
									{item.badge}
								</span>
								<span class="text-zinc-500 font-mono text-[11px]">{item.year}</span>
							</div>
							<h3 class="text-lg font-bold tracking-tight text-white font-sans">
								{item.title}
							</h3>
							<div class="mt-1 text-xs font-semibold text-indigo-400">
								{item.issuer}
							</div>
							<p class="mt-3 text-xs leading-relaxed text-zinc-300 font-sans">
								{item.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- TECHNICAL SKILLS SECTION -->
	<section id="keahlian" class="relative border-t border-white/[0.08] bg-gradient-to-b from-transparent via-[#0d1024]/40 to-transparent py-20 lg:py-24">
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<div>
				<span
					use:reveal={{ type: 'badge', delay: 40 }}
					class="inline-block font-sans text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase"
				>
					Kapabilitas Teknis
				</span>
				<h2
					use:reveal={{ type: 'heading', delay: 100 }}
					class="mt-2 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl"
				>
					Keahlian & Penguasaan Tooling
				</h2>
				<p
					use:reveal={{ type: 'text', delay: 160 }}
					class="mt-2 text-sm text-zinc-400 max-w-xl font-sans"
				>
					Kerangka kerja dan perkakas yang digunakan secara aktif dalam siklus pengembangan perangkat lunak dan riset keamanan.
				</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 font-sans">
				{#each skillGroups as group, idx}
					<div
						use:reveal={{ type: 'card', delay: idx * 90 }}
						use:tilt={{ max: 9, scale: 1.015, glare: true }}
						class="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121622]/60 p-7 flex flex-col justify-between transition hover:border-indigo-500/40"
						onmousemove={handleCardMouseMove}
						role="region"
						aria-label={group.category}
					>
						<div
							class="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							style="background: radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.12), transparent 80%);"
						></div>

						<div class="relative z-10">
							<h3 class="text-base font-bold text-white tracking-tight">
								{group.category}
							</h3>
							<p class="mt-1.5 text-xs text-zinc-400 leading-relaxed font-sans">
								{group.description}
							</p>

							<div class="mt-6 flex flex-wrap gap-2">
								{#each group.items as item}
									<div class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]">
										<span class="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
										<span>{item.name}</span>
										<span class="text-[10px] text-zinc-500 font-mono">· {item.tag}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- TIMELINE & EDUCATION SECTION -->
	<section id="riwayat" class="relative border-t border-white/[0.08] bg-gradient-to-b from-[#090c1a]/70 via-[#0d1226]/50 to-[#080b16]/70 py-20 lg:py-24 backdrop-blur-[2px]">
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<div>
				<span
					use:reveal={{ type: 'badge', delay: 40 }}
					class="inline-block font-sans text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase"
				>
					Rekam Jejak
				</span>
				<h2
					use:reveal={{ type: 'heading', delay: 100 }}
					class="mt-2 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl"
				>
					Riwayat & Pembelajaran
				</h2>
				<p
					use:reveal={{ type: 'text', delay: 160 }}
					class="mt-2 text-sm text-zinc-400 max-w-xl font-sans"
				>
					Jejak pembelajaran kejuruan di SMK Negeri 8 Semarang, proyek sekolah, dan riset mandiri.
				</p>
			</div>

			<div class="mt-12 relative pl-6 sm:pl-8 border-l-2 border-indigo-500/20 space-y-6 font-sans">
				{#each timeline as item, idx}
					<div
						use:reveal={{ type: 'card', delay: idx * 80 }}
						class="relative rounded-2xl border border-white/10 bg-[#0e111a]/60 p-6 transition duration-200 hover:border-indigo-500/30 hover:bg-[#121622]/80"
					>
						<!-- Timeline Node Anchor -->
						<div class="absolute -left-[31px] sm:-left-[39px] top-6 h-3 w-3 rounded-full bg-indigo-500 border-2 border-[#07080d] shadow-sm shadow-indigo-500/50"></div>

						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<h3 class="text-base font-bold text-white font-sans tracking-tight">
								{item.role} <span class="text-indigo-400 font-semibold">@ {item.institution}</span>
							</h3>
							<span class="text-xs font-semibold text-zinc-400 font-mono">{item.period}</span>
						</div>
						<p class="mt-2 text-sm leading-relaxed text-zinc-300 font-sans">
							{item.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- INTERACTIVE DEVELOPER CONSOLE SECTION -->
	<section id="terminal" class="relative border-t border-white/[0.08] bg-gradient-to-b from-transparent via-[#080e1c]/40 to-transparent py-20 lg:py-24">
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-8">
				<span
					use:reveal={{ type: 'badge', delay: 40 }}
					class="inline-block font-sans text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase"
				>
					Developer Interface
				</span>
				<h2
					use:reveal={{ type: 'heading', delay: 100 }}
					class="mt-2 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl"
				>
					Konsol Pengembang Interaktif
				</h2>
				<p
					use:reveal={{ type: 'text', delay: 160 }}
					class="mt-2 text-sm text-zinc-400 font-sans"
				>
					Eksplorasi profil, ringkasan karya, dan data pelajar melalui antarmuka konsol bergaya Unix.
				</p>
			</div>

			<div use:reveal={{ type: 'card', delay: 180 }}>
				<TerminalPrompt />
			</div>
		</div>
	</section>

	<!-- CONTACT & DIRECT FORM SECTION (Mandatory for True Portfolio) -->
	<section id="kontak" class="relative border-t border-white/[0.08] bg-gradient-to-b from-[#0b0e1f] via-[#090c19] to-[#04050a] py-20 lg:py-28">
		<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start font-sans">
				<!-- Left Column: Direct Contact Info & Value Pitch -->
				<div class="flex flex-col gap-6 lg:col-span-5">
					<div>
						<span
							use:reveal={{ type: 'badge', delay: 40 }}
							class="inline-block font-sans text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase"
						>
							Hubungi Saya
						</span>
						<h2
							use:reveal={{ type: 'heading', delay: 100 }}
							class="mt-2 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl"
						>
							Mari Terhubung & Berkolaborasi.
						</h2>
						<p
							use:reveal={{ type: 'text', delay: 160 }}
							class="mt-3 text-sm leading-relaxed text-zinc-400 font-sans"
						>
							Apakah Anda mencari kandidat magang industri (PKL), memiliki pertanyaan teknis, atau ingin mendiskusikan peluang kolaborasi perangkat lunak? Kirimkan pesan Anda melalui formulir atau kontak langsung.
						</p>
					</div>

					<div
						use:reveal={{ type: 'card', delay: 220 }}
						class="space-y-3 font-sans text-xs"
					>
						<div class="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
							<span class="text-zinc-400 font-medium">Email Langsung:</span>
							<button
								type="button"
								onclick={copyEmail}
								class="text-indigo-400 font-bold hover:underline font-sans transition"
								title="Klik untuk menyalin email"
							>
								{copiedEmail ? 'Email Tersalin! ✓' : profile.email}
							</button>
						</div>
						<div class="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
							<span class="text-zinc-400 font-medium">Lokasi:</span>
							<span class="text-zinc-200 font-semibold">{profile.location}</span>
						</div>
						<div class="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
							<span class="text-zinc-400 font-medium">Status Ketersediaan:</span>
							<span class="text-emerald-400 font-bold">Terbuka untuk Magang</span>
						</div>
					</div>

					<div
						use:reveal={{ type: 'card', delay: 280 }}
						class="flex items-center gap-3 font-sans text-xs font-semibold"
					>
						<a
							href={profile.github}
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 font-semibold text-zinc-200 transition hover:border-indigo-500/40 hover:text-white"
						>
							<span>GitHub Repositories ↗</span>
						</a>
						<button
							type="button"
							onclick={() => (isResumeOpen = true)}
							class="flex h-11 items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
						>
							<span>Lihat CV 📄</span>
						</button>
					</div>
				</div>

				<!-- Right Column: Real Interactive Contact Form -->
				<div
					use:reveal={{ type: 'card', delay: 180 }}
					class="lg:col-span-7"
				>
					<ContactForm />
				</div>
			</div>

			<!-- Bottom Metadata Bar -->
			<div class="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center font-sans text-xs text-zinc-500">
				<div>
					© 2026 {profile.name} — SMK Negeri 8 Semarang (PPLG)
				</div>
				<div class="flex items-center gap-3 text-zinc-400 font-medium">
					<span>Semarang, Jawa Tengah (WIB)</span>
					<span>•</span>
					<span>SvelteKit 3 & Tailwind v4</span>
				</div>
			</div>
		</div>
	</section>
</div>
