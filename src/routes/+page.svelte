<script lang="ts">
	import { projects } from '$lib/data';

	type Theme = 'light' | 'dark';

	let theme: Theme = $state('light');
	let nama = $state('');
</script>

<div class="min-h-dvh bg-bg text-ink {theme === 'dark' ? 'dark' : ''}">
	<!-- nav -->
	<header class="border-b border-line">
		<div
			class="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-6 lg:h-[72px] lg:px-24"
		>
			<a href="/" class="text-[15px] font-semibold lg:text-base">Portofolio Ravidya</a>

			<div class="flex items-center gap-2 lg:gap-8">
				<nav class="hidden items-center gap-7 lg:flex">
					<a href="#proyek" class="text-sm text-muted">Proyek</a>
					<a href="#tentang" class="text-sm text-muted">Tentang</a>
					<a href="#kontak" class="text-sm text-muted">Kontak</a>
				</nav>

				<button
					type="button"
					aria-label="Ganti tema"
					onclick={() => (theme = theme === 'dark' ? 'light' : 'dark')}
					class="flex h-11 w-11 items-center justify-center border border-line"
				>
					<svg
						width="17"
						height="17"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="dark:hidden"
					>
						<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
					</svg>
					<svg
						width="17"
						height="17"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						class="hidden dark:block"
					>
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
						/>
					</svg>
				</button>

				<button
					type="button"
					aria-label="Buka menu"
					class="flex h-11 w-11 items-center justify-center border border-line lg:hidden"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					>
						<path d="M4 7h16M4 12h16M4 17h16" />
					</svg>
				</button>
			</div>
		</div>
	</header>

	<!-- hero -->

	<!-- hero -->
	<section class="mx-auto max-w-[1440px] px-6 pt-16 pb-14 lg:px-24 lg:pt-[120px]">
		<!-- Judul utama sekarang akan berubah otomatis mengikuti variabel nama -->
		<h1
			class="text-[62px] leading-[0.88] font-medium tracking-[-1.6px] lg:text-[232px] lg:tracking-[-9px]"
		>
			{nama || 'Ravidya Satrio Adi'}
		</h1>

		<div class="mt-7 flex flex-col gap-6">
			<p class="max-w-[560px] text-[17px] leading-[1.6] text-muted lg:text-xl">
				Siswa SMK jurusan RPL. Membangun antarmuka web yang cepat, rapi, dan mudah dipakai.
			</p>

			<!-- Input sapaan interaktif -->
			<div class="flex max-w-[360px] flex-col gap-2">
				<label for="nama" class="font-mono text-[11px] tracking-[1.1px] text-muted uppercase">
					Ubah Nama
				</label>
				<input
					id="nama"
					type="text"
					bind:value={nama}
					placeholder="Ketik nama baru..."
					class="h-12 border border-line bg-transparent px-4 text-[15px] text-ink placeholder:text-muted focus:border-primary focus:outline-none"
				/>
				<p class="text-[15px] text-ink">
					Halo, <span class="font-medium text-primary">{nama || 'teman'}</span>!
				</p>
			</div>

			<div class="flex items-center gap-3">
				<a
					href="#proyek"
					class="flex h-12 items-center bg-primary px-6 text-[15px] font-medium text-on-primary"
				>
					Lihat proyek
				</a>
				<a
					href="#kontak"
					class="flex h-12 items-center border border-line px-6 text-[15px] text-ink"
				>
					Hubungi saya
				</a>
			</div>

			<p class="font-mono text-[11px] tracking-[1.1px] text-muted">
				TERSEDIA UNTUK PROYEK BARU — 2026
			</p>
		</div>
	</section>


	<!-- band -->
	<div class="border-t border-line">
		<img
			src={theme === 'dark' ? '/images/band-dark.png' : '/images/band-light.png'}
			alt="Foto kegiatan lab RPL"
			class="h-[220px] w-full object-cover lg:h-[420px]"
		/>
		<div class="mx-auto max-w-[1440px] px-6 py-4 lg:px-24">
			<p class="font-mono text-[11px] tracking-[1.1px] text-muted">LAB RPL — SMK NEGERI 8 Semarang · 2026</p>
		</div>
	</div>

	<!-- proyek -->
	<section id="proyek" class="border-t border-line">
		<div class="mx-auto max-w-[1440px] px-6 pt-5 pb-14 lg:px-24 lg:pb-24">
			<p class="font-mono text-[11px] tracking-[1.1px]">PROYEK</p>

			<div class="mt-7 flex flex-col divide-y divide-line lg:mt-10">
				{#each projects as project, i}
					<div class="flex flex-col gap-2.5 py-7">
						<div class="flex items-center justify-between">
							<span class="font-mono text-[11px] tracking-[1.1px]">
								{String(i + 1).padStart(2, '0')}
							</span>
							<div class="flex items-center gap-5">
								<span class="font-mono text-[11px] tracking-[1.1px] uppercase">
									{project.stack}
								</span>
								<span class="font-mono text-[11px] tracking-[1.1px]">{project.year}</span>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-primary"
								>
									<path d="M7 17 17 7M9 7h8v8" />
								</svg>
							</div>
						</div>
						<h2 class="text-[28px] leading-[1.15] font-medium tracking-[-0.5px]">
							{project.title}
						</h2>
						<p class="text-[15px] leading-[1.55] text-muted">{project.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- footer -->
	<footer class="border-t border-line">
		<div class="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-14 lg:px-24">
			<p
				class="max-w-[640px] text-[34px] leading-[1.05] font-medium tracking-[-0.6px] lg:text-[48px] lg:tracking-[-1.2px]"
			>
				Mari membangun sesuatu.
			</p>

			<div
				class="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
			>
				<a href="mailto:kamu@email.com" class="font-mono text-xs tracking-[1.1px] text-primary">
					ravidya.satrioadi@email.com
				</a>
				<div class="flex items-center gap-6">
					<a href="#proyek" class="font-mono text-[11px] tracking-[1.1px] text-muted">PROYEK</a>
					<a
						href="https://github.com/Rapyas-kece"
						class="font-mono text-[11px] tracking-[1.1px] text-muted">GITHUB</a
					>
					<a href="mailto:ravidya.satrioadi@email.com" class="font-mono text-[11px] tracking-[1.1px] text-muted">
						EMAIL
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>

