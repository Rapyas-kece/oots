<script lang="ts">
    import { projects, profile } from '$lib/data';
    import ProjectRow from '$lib/components/ProjectRow.svelte';
    import { enhance } from '$app/forms';
    import { slide } from 'svelte/transition';

    type Theme = 'light' | 'dark';

    let theme: Theme = $state('dark');
    let mobileMenuOpen = $state(false);
    let isSubmitting = $state(false);
    let copied = $state(false);

    let { form } = $props();

    const EMAIL = 'ravidya.satrioadi@gmail.com';
    const GITHUB_URL = 'https://github.com/Rapyas-kece';

    // Daftar proyek spesifik Anda yang terintegrasi langsung
    const myProjects = [
        {
            title: 'oots',
            description: 'Platform open source portal kolaborasi & portofolio interaktif berbasis Svelte, TypeScript, dan Tailwind CSS.',
            tech: ['Svelte', 'TypeScript', 'Tailwind CSS'],
            url: 'https://github.com/Rapyas-kece/oots'
        },
        {
            title: 'cyberstrike-ctf',
            description: 'Toolkit & modul latihan Capture The Flag (CTF) mencakup forensik digital, crypto ciphers, dan network packet analysis.',
            tech: ['Python', 'Bash', 'Security Toolkit'],
            url: 'https://github.com/Rapyas-kece/cyberstrike-ctf'
        },
        {
            title: 'kicora',
            description: 'Sistem manajemen dan pelacakan pesanan digital (Pre-Order / PO) dengan antarmuka cepat dan terstruktur.',
            tech: ['Full-stack', 'Tailwind', 'JavaScript'],
            url: 'https://github.com/Rapyas-kece/kicora'
        }
    ];

    function toggleTheme() {
        theme = theme === 'dark' ? 'light' : 'dark';
    }

    function copyEmail() {
        navigator.clipboard.writeText(EMAIL);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }
</script>

<div class="min-h-dvh bg-bg text-ink selection:bg-amber-500 selection:text-black {theme === 'dark' ? 'dark' : ''}">
    <!-- Sticky Header -->
    <header class="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div class="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-6 lg:h-[72px] lg:px-24">
            <a href="/" class="group flex items-center gap-2.5 text-[15px] font-mono font-bold tracking-tight lg:text-base">
                <span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-transform group-hover:scale-125"></span>
                <span class="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">ravidya@yellow-flash:~#</span>
            </a>

            <div class="flex items-center gap-4 lg:gap-8">
                <nav class="hidden items-center gap-8 lg:flex font-mono text-xs tracking-wider">
                    <a href="#proyek" class="text-muted transition-colors hover:text-amber-400">[01.PROYEK]</a>
                    <a href="#minato" class="text-muted transition-colors hover:text-amber-400">[02.HIRAISHIN]</a>
                    <a href="#tentang" class="text-muted transition-colors hover:text-amber-400">[03.TENTANG]</a>
                    <a href="#kontak" class="text-muted transition-colors hover:text-amber-400">[04.KONTAK]</a>
                </nav>

                <!-- Theme Toggle -->
                <button
                    type="button"
                    aria-label="Ganti tema"
                    onclick={toggleTheme}
                    class="flex h-10 w-10 cursor-pointer items-center justify-center border border-line transition-colors hover:border-amber-400 hover:text-amber-400"
                >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="dark:hidden">
                        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                    </svg>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="hidden dark:block">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </svg>
                </button>

                <!-- Mobile Menu Toggle -->
                <button
                    type="button"
                    aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                    aria-expanded={mobileMenuOpen}
                    onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
                    class="flex h-10 w-10 cursor-pointer items-center justify-center border border-line transition-colors hover:border-amber-400 lg:hidden"
                >
                    {#if mobileMenuOpen}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    {:else}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    {/if}
                </button>
            </div>
        </div>

        <!-- Mobile Navigation Drawer -->
        {#if mobileMenuOpen}
            <nav transition:slide={{ duration: 200 }} class="border-t border-line bg-bg px-6 py-5 lg:hidden">
                <div class="flex flex-col gap-4 font-mono text-xs">
                    <a href="#proyek" onclick={() => (mobileMenuOpen = false)} class="text-muted transition-colors hover:text-amber-400">01 / PROYEK</a>
                    <a href="#minato" onclick={() => (mobileMenuOpen = false)} class="text-muted transition-colors hover:text-amber-400">02 / HIRAISHIN MODE</a>
                    <a href="#tentang" onclick={() => (mobileMenuOpen = false)} class="text-muted transition-colors hover:text-amber-400">03 / TENTANG</a>
                    <a href="#kontak" onclick={() => (mobileMenuOpen = false)} class="text-muted transition-colors hover:text-amber-400">04 / KONTAK</a>
                </div>
            </nav>
        {/if}
    </header>

    <!-- Hero Section -->
    <section class="mx-auto max-w-[1440px] px-6 pt-14 pb-16 lg:px-24 lg:pt-28 lg:pb-24">
        <div class="mb-6 flex items-center gap-2.5">
            <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            </span>
            <span class="font-mono text-[11px] tracking-[1.2px] text-amber-400 uppercase">
                [SPEED & PRECISION] — PPLG SMKN 8 SEMARANG // CYBERSECURITY & FULL-STACK
            </span>
        </div>

        <h1 class="text-[clamp(3.25rem,11vw,11.5rem)] leading-[0.9] font-medium tracking-[-0.04em]">
            Ravidya<br />
            <span class="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">Satrio Adi.</span>
        </h1>

        <div class="mt-10 flex flex-col justify-between gap-8 lg:mt-14 lg:flex-row lg:items-end">
            <p class="max-w-[580px] font-mono text-[15px] leading-[1.65] text-muted lg:text-lg">
                root@smkn8:~# Pelajar <strong class="text-ink">PPLG</strong> & penggiat <span class="text-amber-400">Cybersecurity / CTF</span>. Mengeksekusi kode secepat kilat, merancang arsitektur sistem tangguh dengan efisiensi tingkat tinggi.
            </p>

            <div class="flex flex-wrap items-center gap-3">
                <a href="#proyek" class="flex h-12 items-center bg-amber-500 px-7 font-mono text-xs uppercase tracking-wider text-black font-semibold transition-all hover:bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    Eksplorasi Karya
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" class="flex h-12 items-center gap-2 border border-line px-6 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-amber-400 hover:text-amber-400">
                    <span>GitHub Repositories</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                </a>
            </div>
        </div>
    </section>

    <!-- Minato / Hiraishin Cyber Banner (Aspect Ratio 4:5 Visual Showcase) -->
    <section id="minato" class="border-t border-line bg-black/50 py-16 lg:py-24">
        <div class="mx-auto max-w-[1440px] px-6 lg:px-24">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div class="lg:col-span-6 flex flex-col gap-6">
                    <div>
                        <span class="font-mono text-xs text-amber-400 tracking-widest">[02 / THE YELLOW FLASH VIBE]</span>
                        <h2 class="text-3xl lg:text-5xl font-medium tracking-tight mt-2">Hiraishin no Jutsu // Kecepatan & Ketepatan Eksekusi</h2>
                    </div>
                    <p class="font-mono text-sm lg:text-base text-muted leading-relaxed">
                        Terinspirasi dari Minato Namikaze (Kokonoha's Yellow Flash), setiap baris kode Svelte, skrip keamanan jaringan, hingga penetrasi CTF diselesaikan dengan kalkulasi matang, kecepatan kilat, dan fokus mutlak tanpa celah.
                    </p>
                    <div class="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
                        <div class="border border-line p-4 bg-bg/40">
                            <span class="text-amber-400 block text-lg font-bold">0.1ms</span>
                            <span class="text-muted">Response Time Target</span>
                        </div>
                        <div class="border border-line p-4 bg-bg/40">
                            <span class="text-amber-400 block text-lg font-bold">100%</span>
                            <span class="text-muted">Logic Precision</span>
                        </div>
                    </div>
                </div>

                <!-- Foto 4:5 Minato Cyber Theme -->
                <div class="lg:col-span-6 flex justify-center">
                    <div class="relative group w-full max-w-[420px] aspect-[4/5] border-2 border-amber-500/50 overflow-hidden shadow-[0_0_35px_rgba(245,158,11,0.2)]">
                        <img
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
                            alt="Minato Cyber Flash Vibe"
                            class="h-full w-full object-cover filter contrast-125 saturate-150 transition-transform duration-700 group-hover:scale-105"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6">
                            <span class="font-mono text-xs text-amber-400">STATUS: SEALED & SECURED</span>
                            <p class="text-white text-base font-semibold mt-1">"Kilat Kuning: Cepat, Efisien, Tanpa Ampun pada Bug."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Proyek Section (Integrated GitHub Repos) -->
    <section id="proyek" class="scroll-mt-16 border-t border-line">
        <div class="mx-auto max-w-[1440px] px-6 pt-8 pb-16 lg:px-24 lg:pt-12 lg:pb-28">
            <div class="flex items-baseline justify-between">
                <p class="font-mono text-[11px] tracking-[1.2px] text-amber-400">01 / PROYEK UTAMA & GITHUB</p>
                <span class="font-mono text-[11px] tracking-[1.1px] text-muted">
                    ({myProjects.length.toString().padStart(2, '0')})
                </span>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:mt-12">
                {#each myProjects as proj}
                    <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group border border-line bg-bg/50 p-6 flex flex-col justify-between transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-1"
                    >
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="font-mono text-xs text-amber-400">REPOSITORY</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-muted transition-colors group-hover:text-amber-400">
                                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-medium tracking-tight mt-3 group-hover:text-amber-400 transition-colors">{proj.title}</h3>
                            <p class="font-mono text-xs text-muted mt-2 leading-relaxed">{proj.description}</p>
                        </div>
                        <div class="flex flex-wrap gap-2 pt-6">
                            {#each proj.tech as t}
                                <span class="border border-line px-2.5 py-1 font-mono text-[10px] text-muted">{t}</span>
                            {/each}
                        </div>
                    </a>
                {/each}
            </div>

            <!-- Existing Projects List integration -->
            <div class="mt-12 flex flex-col divide-y divide-line">
                {#each projects as project, i (project.title)}
                    <ProjectRow {project} index={i} />
                {/each}
            </div>
        </div>
    </section>

    <!-- Tentang Section -->
    <section id="tentang" class="scroll-mt-16 border-t border-line">
        <div class="mx-auto max-w-[1440px] px-6 pt-8 pb-16 lg:px-24 lg:pt-12 lg:pb-28">
            <p class="font-mono text-[11px] tracking-[1.2px] text-amber-400">03 / TENTANG SAYA</p>

            <div class="mt-8 flex flex-col items-start gap-10 lg:mt-12 lg:flex-row lg:gap-20">
                <div class="w-full shrink-0 lg:w-[420px]">
                    <div class="border border-line p-2 bg-bg relative">
                        <img
                            src={theme === 'dark' ? '/images/portrait-dark.png' : '/images/portrait-light.png'}
                            alt="Potret Ravidya Satrio Adi"
                            class="h-[400px] w-full object-cover filter contrast-110"
                        />
                        <div class="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur border border-line p-3">
                            <span class="font-mono text-[10px] text-amber-400 block">&gt; operator_id.sh</span>
                            <span class="font-mono text-xs text-white">SMKN 8 Semarang // PPLG X</span>
                        </div>
                    </div>
                </div>

                <div class="flex w-full flex-col gap-8">
                    <p class="max-w-[580px] font-mono text-base leading-[1.7] text-muted lg:text-lg">
                        {profile.bio}
                    </p>

                    <div class="flex flex-col divide-y divide-line border-y border-line font-mono text-xs">
                        {#each profile.facts as fact}
                            <div class="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center sm:gap-8">
                                <span class="tracking-[1.1px] text-muted uppercase">
                                    {fact.label}
                                </span>
                                <span class="font-medium text-ink">{fact.value}</span>
                            </div>
                        {/each}
                    </div>

                    <div class="flex flex-col gap-3.5">
                        <span class="font-mono text-[11px] tracking-[1.1px] text-amber-400">
                            STACK & KAPABILITAS TEKNIS
                        </span>
                        <div class="flex flex-wrap gap-2">
                            {#each profile.skills as skill}
                                <span class="border border-line px-3 py-1.5 font-mono text-[11px] tracking-[1.1px] text-muted transition-colors hover:border-amber-400 hover:text-amber-400">
                                    {skill}
                                </span>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Kontak Section -->
    <section id="kontak" class="scroll-mt-16 border-t border-line">
        <div class="mx-auto max-w-[1440px] px-6 pt-8 pb-16 lg:px-24 lg:pt-12 lg:pb-28">
            <p class="font-mono text-[11px] tracking-[1.2px] text-amber-400">04 / KONTAK</p>

            <div class="mt-8 flex flex-col gap-12 lg:mt-12 lg:flex-row lg:gap-24">
                <div class="flex flex-col justify-between lg:w-1/2">
                    <div>
                        <h2 class="text-[32px] leading-[1.1] font-medium tracking-[-0.6px] lg:text-[48px]">
                            Inisiasi koneksi &<br />amankan sistem Anda.
                        </h2>
                        <p class="mt-4 max-w-[440px] font-mono text-sm leading-[1.6] text-muted">
                            Terbuka untuk diskusi web development, audit keamanan siber, kolaborasi CTF, maupun pengembangan aplikasi berbasis AI.
                        </p>
                    </div>

                    <div class="mt-8 border-l-2 border-amber-400 pl-4 lg:mt-0">
                        <p class="font-mono text-[11px] tracking-[1.1px] text-amber-400">SECURE EMAIL</p>
                        <div class="mt-1 flex items-center gap-3">
                            <a href="mailto:{EMAIL}" class="font-mono text-[15px] font-medium text-ink hover:text-amber-400 hover:underline">
                                {EMAIL}
                            </a>
                            <button
                                type="button"
                                onclick={copyEmail}
                                class="cursor-pointer border border-line px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted transition-colors hover:border-amber-400 hover:text-amber-400"
                            >
                                {copied ? 'COPIED!' : 'COPY'}
                            </button>
                        </div>
                    </div>
                </div>

                <form
                    method="POST"
                    use:enhance={() => {
                        isSubmitting = true;
                        return async ({ update }) => {
                            await update();
                            isSubmitting = false;
                        };
                    }}
                    class="flex flex-col gap-6 lg:w-1/2"
                >
                    <div class="flex flex-col gap-2">
                        <label for="email" class="font-mono text-[11px] tracking-[1.1px] text-muted">
                            EMAIL ANDA
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="operator@domain.com"
                            class="border border-line bg-transparent px-4 py-3.5 font-mono text-[15px] text-ink transition-colors placeholder:text-muted/40 focus:border-amber-400 focus:outline-none"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="pesan" class="font-mono text-[11px] tracking-[1.1px] text-muted">
                            DETAIL PESAN / PAYLOAD
                        </label>
                        <textarea
                            id="pesan"
                            name="pesan"
                            required
                            rows={5}
                            placeholder="Tuliskan detail kolaborasi, kendala teknis, atau penawaran proyek..."
                            class="resize-none border border-line bg-transparent px-4 py-3.5 font-mono text-[15px] text-ink transition-colors placeholder:text-muted/40 focus:border-amber-400 focus:outline-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="flex h-12 cursor-pointer items-center justify-center bg-amber-500 px-6 font-mono text-xs uppercase tracking-wider text-black font-semibold transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                        {isSubmitting ? 'TRANSMITTING...' : 'KIRIM PESAN [TRANSMIT]'}
                    </button>

                    {#if form?.success}
                        <div class="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 font-mono text-xs text-emerald-400">
                            &gt; Transmisi sukses! Pesan telah diterima oleh Ravidya.
                        </div>
                    {/if}
                    {#if form?.error}
                        <div class="border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
                            &gt; Error: {form.error}
                        </div>
                    {/if}
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-line">
        <div class="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-14 lg:px-24">
            <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <p class="max-w-[640px] text-[32px] leading-[1.08] font-medium tracking-[-0.6px] lg:text-[48px]">
                    Speed, security, absolute precision.
                </p>
                <p class="font-mono text-[11px] tracking-[1.1px] text-muted">
                    © {new Date().getFullYear()} RAVIDYA SATRIO ADI // PPLG SMKN 8 SEMARANG
                </p>
            </div>

            <div class="flex flex-col items-start gap-4 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 font-mono text-xs">
                <a href="mailto:{EMAIL}" class="text-amber-400 transition-opacity hover:opacity-80">
                    {EMAIL}
                </a>
                <div class="flex items-center gap-6">
                    <a href="#proyek" class="text-muted transition-colors hover:text-amber-400">PROYEK</a>
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" class="text-muted transition-colors hover:text-amber-400">GITHUB (@Rapyas-kece)</a>
                    <a href="mailto:{EMAIL}" class="text-muted transition-colors hover:text-amber-400">EMAIL</a>
                </div>
            </div>
        </div>
    </footer>
</div>