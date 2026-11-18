<script lang="ts">
	import { profile, projects, skillGroups, achievements, timeline } from '$lib/data';

	let { isOpen = $bindable(false) }: { isOpen: boolean } = $props();

	function printResume() {
		window.print();
	}
</script>

{#if isOpen}
	<div
		class="cv-modal-backdrop fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
		onclick={() => (isOpen = false)}
		role="presentation"
	>
		<div
			class="cv-modal-card relative my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#0f121d] text-slate-100 shadow-2xl p-6 sm:p-10 font-sans"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="0"
		>
			<!-- Action Header Bar -->
			<div class="no-print flex items-center justify-between border-b border-white/10 pb-5 mb-6 font-sans">
				<div class="flex items-center gap-2">
					<span class="rounded bg-indigo-500/20 px-2.5 py-0.5 text-xs text-indigo-300 font-bold border border-indigo-500/30 tracking-wider">
						CURRICULUM VITAE
					</span>
					<span class="text-xs text-zinc-400">Diperbarui: 2026</span>
				</div>
				<div class="flex items-center gap-2.5">
					<button
						type="button"
						onclick={printResume}
						class="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 font-sans text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-95 shadow-sm"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="6 9 6 2 18 2 18 9"/>
							<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
							<rect x="6" y="14" width="12" height="8"/>
						</svg>
						<span>Cetak / PDF</span>
					</button>
					<button
						type="button"
						onclick={() => (isOpen = false)}
						class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-sans text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
					>
						✕ Tutup
					</button>
				</div>
			</div>

			<!-- CV Content Body -->
			<div class="space-y-6 text-sm leading-relaxed font-sans">
				<!-- Header Info -->
				<div>
					<h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white cv-title">
						{profile.name}
					</h1>
					<p class="text-indigo-400 font-semibold text-xs sm:text-sm mt-1 cv-subtitle">
						{profile.role} · {profile.school}
					</p>
					<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 cv-meta">
						<span>Email: <strong class="text-zinc-300 font-medium">{profile.email}</strong></span>
						<span>•</span>
						<span>Lokasi: {profile.location}</span>
						<span>•</span>
						<span>NISN: <strong class="font-mono text-zinc-300 font-semibold">{profile.nisn}</strong></span>
					</div>
				</div>

				<!-- Summary -->
				<div class="border-t border-white/10 pt-4 cv-section">
					<h2 class="text-xs font-bold uppercase tracking-[0.15em] text-indigo-400 mb-1.5 cv-heading">
						Ringkasan Profil
					</h2>
					<p class="text-zinc-300 cv-body">
						{profile.bio}
					</p>
				</div>

				<!-- Education -->
				<div class="border-t border-white/10 pt-4 cv-section">
					<h2 class="text-xs font-bold uppercase tracking-[0.15em] text-indigo-400 mb-2 cv-heading">
						Pendidikan
					</h2>
					<div class="flex justify-between items-start">
						<div>
							<div class="font-bold text-white cv-subheading">{profile.school}</div>
							<div class="text-xs text-zinc-400 cv-body">{profile.major} — Kelas {profile.class}</div>
						</div>
						<div class="text-xs text-zinc-400 font-mono cv-meta">2024 — 2027 (Aktif)</div>
					</div>
				</div>

				<!-- Core Competencies -->
				<div class="border-t border-white/10 pt-4 cv-section">
					<h2 class="text-xs font-bold uppercase tracking-[0.15em] text-indigo-400 mb-2 cv-heading">
						Keahlian Utama
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{#each skillGroups as group}
							<div class="rounded-lg bg-white/[0.02] border border-white/5 p-3 cv-card">
								<div class="text-xs font-bold text-white cv-subheading">{group.category}</div>
								<div class="mt-1.5 flex flex-wrap gap-1">
									{#each group.items as item}
										<span class="rounded bg-white/5 px-1.5 py-0.5 text-[10.5px] font-mono text-zinc-300 cv-badge">
											{item.name}
										</span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Featured Projects Case Studies -->
				<div class="border-t border-white/10 pt-4 cv-section">
					<h2 class="text-xs font-bold uppercase tracking-[0.15em] text-indigo-400 mb-2 cv-heading">
						Proyek & Studi Kasus Rekayasa
					</h2>
					<div class="space-y-3">
						{#each projects as p}
							<div class="rounded-lg bg-white/[0.02] border border-white/5 p-3 cv-card">
								<div class="flex justify-between items-start text-xs font-sans">
									<span class="font-bold text-white cv-subheading">{p.title}</span>
									<span class="text-zinc-400 font-mono text-[11px] cv-meta">{p.year}</span>
								</div>
								<div class="text-xs text-indigo-300 font-semibold mt-0.5 cv-role">{p.role}</div>
								<p class="text-xs text-zinc-300 mt-1 cv-body">{p.impact}</p>
								<div class="mt-2 flex flex-wrap gap-1 font-mono text-[10px] text-zinc-400">
									{#each p.stack as s}
										<span class="rounded bg-white/5 px-1.5 py-0.5 cv-badge">{s}</span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Achievements -->
				<div class="border-t border-white/10 pt-4 cv-section">
					<h2 class="text-xs font-bold uppercase tracking-[0.15em] text-indigo-400 mb-2 cv-heading">
						Pencapaian & Sertifikasi
					</h2>
					<ul class="space-y-1.5 list-disc list-inside text-xs text-zinc-300 cv-body">
						{#each achievements as a}
							<li>
								<strong class="text-white cv-subheading">{a.title}</strong> — {a.issuer} ({a.year})
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@media print {
		.cv-modal-backdrop {
			position: static !important;
			background: white !important;
			padding: 0 !important;
			display: block !important;
		}
		.cv-modal-card {
			background: white !important;
			color: #0f172a !important;
			border: none !important;
			box-shadow: none !important;
			max-width: 100% !important;
			padding: 0 !important;
			margin: 0 !important;
		}
		.no-print {
			display: none !important;
		}
		.cv-title,
		.cv-subheading {
			color: #0f172a !important;
		}
		.cv-subtitle,
		.cv-heading,
		.cv-role {
			color: #3730a3 !important;
		}
		.cv-body {
			color: #334155 !important;
		}
		.cv-meta {
			color: #64748b !important;
		}
		.cv-section {
			border-color: #cbd5e1 !important;
		}
		.cv-card {
			background: #f8fafc !important;
			border-color: #e2e8f0 !important;
		}
		.cv-badge {
			background: #e2e8f0 !important;
			color: #1e293b !important;
		}
	}
</style>
