<script lang="ts">
	import { profile, projects, skillGroups } from '$lib/data';

	type HistoryItem = {
		id: number;
		command: string;
		output: string | string[];
		isError?: boolean;
	};

	let inputVal = $state('');
	let history = $state<HistoryItem[]>([
		{
			id: 1,
			command: 'whoami',
			output: [
				`${profile.name} — ${profile.role}`,
				`Institusi: ${profile.school} (${profile.class})`,
				`Fokus: Web Engineering, SvelteKit, TypeScript & Cyber Security`,
				`Ketik 'help' untuk daftar perintah yang tersedia.`
			]
		}
	]);

	let terminalBody: HTMLDivElement | undefined = $state();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			executeCommand(inputVal.trim());
			inputVal = '';
		}
	}

	function executeCommand(rawCmd: string) {
		if (!rawCmd) return;
		const cmd = rawCmd.toLowerCase();

		let output: string | string[] = '';
		let isError = false;

		if (cmd === 'clear') {
			history = [];
			return;
		} else if (cmd === 'help') {
			output = [
				'Perintah tersedia:',
				'  whoami     - Profil & latar belakang pengembang',
				'  projects   - Ringkasan proyek unggulan',
				'  skills     - Daftar keahlian teknis & stack',
				'  student_id - Informasi kartu pelajar SMK Negeri 8 Semarang',
				'  contact    - Saluran komunikasi & email',
				'  clear      - Membersihkan tampilan terminal'
			];
		} else if (cmd === 'whoami') {
			output = [
				`Nama      : ${profile.name} (${profile.shortName})`,
				`NISN      : ${profile.nisn}`,
				`Sekolah   : ${profile.school}`,
				`Jurusan   : ${profile.major} — ${profile.class}`,
				`Bio       : ${profile.bio}`
			];
		} else if (cmd === 'projects') {
			output = projects.map(
				(p, idx) => `[0${idx + 1}] ${p.title} (${p.category}) — ${p.stack.join(', ')}`
			);
		} else if (cmd === 'skills') {
			output = [];
			skillGroups.forEach((group) => {
				(output as string[]).push(`[ ${group.category} ]`);
				(output as string[]).push(`  ${group.items.map((i) => i.name).join(' · ')}`);
			});
		} else if (cmd === 'student_id') {
			output = [
				'-------------------------------------------------------',
				`KARTU PELAJAR — ${profile.school.toUpperCase()}`,
				'-------------------------------------------------------',
				`Nama       : ${profile.name}`,
				`NISN       : ${profile.nisn}`,
				`Kelas      : ${profile.class}`,
				`Jurusan    : ${profile.major}`,
				`TTL        : ${profile.birthplace}`,
				`Masa Aktif : 2024 — 2027`
			];
		} else if (cmd === 'contact') {
			output = [
				`Email     : ${profile.email}`,
				`GitHub    : ${profile.github}`,
				`Lokasi    : ${profile.location}`
			];
		} else {
			output = `Perintah '${rawCmd}' tidak ditemukan. Ketik 'help' untuk daftar perintah.`;
			isError = true;
		}

		history = [
			...history,
			{
				id: Date.now(),
				command: rawCmd,
				output,
				isError
			}
		];

		setTimeout(() => {
			if (terminalBody) {
				terminalBody.scrollTop = terminalBody.scrollHeight;
			}
		}, 10);
	}

	function runQuickCmd(cmdName: string) {
		executeCommand(cmdName);
	}
</script>

<div class="overflow-hidden rounded-xl border border-white/10 bg-[#0d1017] shadow-2xl">
	<!-- macOS / Unix style terminal titlebar -->
	<div class="flex items-center justify-between border-b border-white/10 bg-zinc-950/70 px-4 py-3">
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full bg-rose-500/80"></div>
			<div class="h-3 w-3 rounded-full bg-amber-500/80"></div>
			<div class="h-3 w-3 rounded-full bg-emerald-500/80"></div>
			<span class="ml-2 font-mono text-xs text-zinc-400">ravidya@smkn8: ~</span>
		</div>

		<!-- Quick command chips -->
		<div class="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
			<span class="text-zinc-500 mr-1">Quick:</span>
			{#each ['whoami', 'projects', 'skills', 'student_id', 'clear'] as quickCmd}
				<button
					type="button"
					onclick={() => runQuickCmd(quickCmd)}
					class="rounded bg-white/5 px-2 py-0.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
				>
					{quickCmd}
				</button>
			{/each}
		</div>
	</div>

	<!-- Terminal Scroll Body -->
	<div
		bind:this={terminalBody}
		class="h-[300px] overflow-y-auto p-4 font-mono text-xs leading-relaxed text-zinc-200 select-text"
	>
		{#each history as item}
			<div class="mb-3">
				<div class="flex items-center gap-2 text-zinc-400">
					<span class="text-indigo-400 font-bold">❯</span>
					<span class="text-zinc-100 font-semibold">{item.command}</span>
				</div>

				<div class="mt-1 pl-4 {item.isError ? 'text-rose-400' : 'text-zinc-300'}">
					{#if Array.isArray(item.output)}
						{#each item.output as line}
							<div class="py-0.5">{line}</div>
						{/each}
					{:else}
						<div>{item.output}</div>
					{/if}
				</div>
			</div>
		{/each}

		<!-- Active prompt line -->
		<div class="flex items-center gap-2 pt-1">
			<span class="text-indigo-400 font-bold">❯</span>
			<input
				type="text"
				bind:value={inputVal}
				onkeydown={handleKeydown}
				placeholder="Ketik perintah (contoh: 'help', 'projects', 'skills')..."
				class="flex-1 bg-transparent font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
			/>
		</div>
	</div>
</div>
