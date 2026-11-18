<script lang="ts">
	import { onMount } from 'svelte';
	import { profile, projects } from '$lib/data';

	let { isOpen = $bindable(false), onFlipCard }: { isOpen: boolean; onFlipCard?: () => void } = $props();

	let searchQuery = $state('');
	let selectedIndex = $state(0);
	let copiedToast = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();

	type Command = {
		id: string;
		label: string;
		category: string;
		icon: string;
		action: () => void;
	};

	const commands: Command[] = [
		{
			id: 'about',
			label: 'Navigasi: Tentang Ravidya',
			category: 'Navigasi Halaman',
			icon: 'user',
			action: () => navigateTo('#tentang')
		},
		{
			id: 'projects',
			label: 'Navigasi: Studi Kasus Proyek',
			category: 'Navigasi Halaman',
			icon: 'code',
			action: () => navigateTo('#studi-kasus')
		},
		{
			id: 'spatial-3d',
			label: 'Navigasi: Lab Grafika 3D Interaktif',
			category: 'Navigasi Halaman',
			icon: 'box',
			action: () => navigateTo('#spatial-3d')
		},
		{
			id: 'skills',
			label: 'Navigasi: Kapabilitas Teknis',
			category: 'Navigasi Halaman',
			icon: 'cpu',
			action: () => navigateTo('#keahlian')
		},
		{
			id: 'achievements',
			label: 'Navigasi: Pencapaian & Kredibilitas',
			category: 'Navigasi Halaman',
			icon: 'award',
			action: () => navigateTo('#prestasi')
		},
		{
			id: 'timeline',
			label: 'Navigasi: Riwayat & Pengalaman',
			category: 'Navigasi Halaman',
			icon: 'history',
			action: () => navigateTo('#riwayat')
		},
		{
			id: 'terminal',
			label: 'Navigasi: Konsol Terminal',
			category: 'Navigasi Halaman',
			icon: 'terminal',
			action: () => navigateTo('#terminal')
		},
		{
			id: 'contact',
			label: 'Navigasi: Kontak & Kolaborasi',
			category: 'Navigasi Halaman',
			icon: 'mail',
			action: () => navigateTo('#kontak')
		},
		{
			id: 'flip-card',
			label: 'Aksi: Putar Kartu Pelajar 3D (180°)',
			category: 'Interaksi Visual',
			icon: 'rotate',
			action: () => {
				onFlipCard?.();
				isOpen = false;
			}
		},
		{
			id: 'copy-email',
			label: 'Aksi: Salin Alamat Email',
			category: 'Aksi Cepat',
			icon: 'copy',
			action: () => {
				navigator.clipboard.writeText(profile.email);
				copiedToast = true;
				setTimeout(() => {
					copiedToast = false;
					isOpen = false;
				}, 1200);
			}
		},
		{
			id: 'open-github',
			label: 'Aksi: Buka Repositori GitHub',
			category: 'Aksi Cepat',
			icon: 'github',
			action: () => {
				window.open(profile.github, '_blank');
				isOpen = false;
			}
		}
	];

	let filteredCommands = $derived(
		searchQuery.trim() === ''
			? commands
			: commands.filter((c) =>
					c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
					c.category.toLowerCase().includes(searchQuery.toLowerCase())
				)
	);

	function navigateTo(hash: string) {
		isOpen = false;
		const el = document.querySelector(hash);
		el?.scrollIntoView({ behavior: 'smooth' });
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			isOpen = !isOpen;
			if (isOpen) {
				setTimeout(() => inputEl?.focus(), 50);
			}
		} else if (e.key === 'Escape' && isOpen) {
			isOpen = false;
		} else if (isOpen) {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				selectedIndex = (selectedIndex + 1) % filteredCommands.length;
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
			} else if (e.key === 'Enter') {
				e.preventDefault();
				if (filteredCommands[selectedIndex]) {
					filteredCommands[selectedIndex].action();
				}
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	$effect(() => {
		if (isOpen) {
			searchQuery = '';
			selectedIndex = 0;
			setTimeout(() => inputEl?.focus(), 50);
		}
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 p-4 pt-20 backdrop-blur-md transition-opacity"
		onclick={() => (isOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
		tabindex="-1"
		role="presentation"
	>
		<!-- Palette Container -->
		<div
			class="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#0f121a] shadow-2xl shadow-black/80"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="0"
		>
			<!-- Search Bar -->
			<div class="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-zinc-400">
					<circle cx="11" cy="11" r="8"/>
					<path d="m21 21-4.3-4.3"/>
				</svg>
				<input
					bind:this={inputEl}
					bind:value={searchQuery}
					type="text"
					placeholder="Ketik perintah atau navigasi (misal: 'proyek', 'kontak', 'putar')..."
					class="w-full bg-transparent font-sans text-sm text-white placeholder:text-zinc-500 focus:outline-none"
				/>
				<span class="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-400">ESC</span>
			</div>

			<!-- Commands List -->
			<div class="max-h-[320px] overflow-y-auto p-2 font-sans text-xs">
				{#if copiedToast}
					<div class="my-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3 text-center text-xs font-semibold text-emerald-300">
						✓ Alamat email {profile.email} berhasil disalin ke clipboard!
					</div>
				{/if}
				{#if filteredCommands.length === 0}
					<div class="py-8 text-center text-zinc-500">
						Tidak ada perintah yang cocok dengan "{searchQuery}"
					</div>
				{:else}
					{#each filteredCommands as cmd, idx}
						<button
							type="button"
							onclick={() => cmd.action()}
							onmouseenter={() => (selectedIndex = idx)}
							class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition {selectedIndex === idx ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-zinc-300 hover:bg-white/5'}"
						>
							<div class="flex items-center gap-3">
								<span class="text-xs {selectedIndex === idx ? 'text-white' : 'text-indigo-400'}">❯</span>
								<span class="font-medium">{cmd.label}</span>
							</div>
							<span class="text-[10px] {selectedIndex === idx ? 'text-indigo-200' : 'text-zinc-400'}">{cmd.category}</span>
						</button>
					{/each}
				{/if}
			</div>

			<!-- Keyboard Helper Footer -->
			<div class="flex items-center justify-between border-t border-white/10 bg-zinc-950/60 px-4 py-2 font-mono text-[10px] text-zinc-500">
				<div class="flex items-center gap-3">
					<span><strong class="text-zinc-400">↑↓</strong> Navigasi</span>
					<span><strong class="text-zinc-400">↵</strong> Pilih</span>
				</div>
				<span>Command Palette</span>
			</div>
		</div>
	</div>
{/if}
