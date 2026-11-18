<script lang="ts">
	let name = $state('');
	let email = $state('');
	let subject = $state('Peluang Magang / Kolaborasi Proyek');
	let message = $state('');

	let isSubmitting = $state(false);
	let isSent = $state(false);
	let errorMessage = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';

		if (!name.trim() || !email.trim() || !message.trim()) {
			errorMessage = 'Mohon lengkapi semua kolom formulir.';
			return;
		}

		if (!email.includes('@') || !email.includes('.')) {
			errorMessage = 'Format alamat email tidak valid.';
			return;
		}

		isSubmitting = true;

		// Simulated submission delay for realistic interactive UX
		setTimeout(() => {
			isSubmitting = false;
			isSent = true;
			name = '';
			email = '';
			message = '';
		}, 800);
	}

	function resetForm() {
		isSent = false;
		errorMessage = '';
	}
</script>

<div class="rounded-2xl border border-white/10 bg-[#121622]/70 p-6 sm:p-8 backdrop-blur-md shadow-xl">
	{#if isSent}
		<div class="flex flex-col items-center justify-center py-8 text-center space-y-3">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<polyline points="20 6 9 17 4 12"/>
				</svg>
			</div>
			<h3 class="text-lg font-bold text-white font-sans">
				Pesan Berhasil Terkirim!
			</h3>
			<p class="text-xs text-zinc-300 max-w-sm">
				Terima kasih atas pesan dan ketertarikan Anda. Ravidya akan segera merespons melalui email yang Anda cantumkan.
			</p>
			<button
				type="button"
				onclick={resetForm}
				class="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-sans text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition"
			>
				Kirim Pesan Lain
			</button>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="flex items-center justify-between border-b border-white/10 pb-3 mb-2 font-sans">
				<span class="text-xs font-bold text-indigo-400 uppercase tracking-[0.15em]">
					Formulir Komunikasi Cepat
				</span>
				<span class="text-[11px] font-medium text-zinc-400">Respon &lt; 24 Jam</span>
			</div>

			{#if errorMessage}
				<div class="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 font-sans text-xs font-medium text-rose-300">
					{errorMessage}
				</div>
			{/if}

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="space-y-1">
					<label for="name" class="font-sans text-xs font-semibold text-zinc-300">Nama Lengkap</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Nama Anda atau Perusahaan"
						class="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition"
					/>
				</div>
				<div class="space-y-1">
					<label for="email" class="font-sans text-xs font-semibold text-zinc-300">Alamat Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="email.anda@domain.com"
						class="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition"
					/>
				</div>
			</div>

			<div class="space-y-1">
				<label for="subject" class="font-sans text-xs font-semibold text-zinc-300">Tujuan Komunikasi</label>
				<select
					id="subject"
					bind:value={subject}
					class="w-full rounded-xl border border-white/10 bg-[#0d1018] px-3.5 py-2.5 font-sans text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none transition"
				>
					<option value="Peluang Magang / Kolaborasi Proyek">Peluang Magang Industri / PKL 2026</option>
					<option value="Kolaborasi Proyek Perangkat Lunak">Kolaborasi Proyek Web / Mobile</option>
					<option value="Diskusi Teknis & Riset Keamanan">Diskusi Teknis & CTF</option>
					<option value="Pertanyaan Umum">Pertanyaan Umum Lainnya</option>
				</select>
			</div>

			<div class="space-y-1">
				<label for="message" class="font-sans text-xs font-semibold text-zinc-300">Isi Pesan</label>
				<textarea
					id="message"
					rows="4"
					bind:value={message}
					placeholder="Tuliskan pesan, rincian tawaran magang, atau ajakan diskusi teknis Anda di sini..."
					class="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition resize-none"
				></textarea>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-sans text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
			>
				{#if isSubmitting}
					<span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
					<span>Mengirim Pesan...</span>
				{:else}
					<span>Kirim Pesan Sekarang ✉</span>
				{/if}
			</button>
		</form>
	{/if}
</div>
