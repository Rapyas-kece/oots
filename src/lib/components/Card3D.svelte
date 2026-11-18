<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '$lib/data';

	// Physical spring pendulum coordinates
	let cardX = $state(0);
	let cardY = $state(130);
	let rotX = $state(0);
	let rotY = $state(0);
	let rotZ = $state(0);

	let isFlipped = $state(false);
	let isDragging = $state(false);
	let isHovering = $state(false);

	// Physics velocities
	let vx = 0;
	let vy = 0;

	// Drag tracking
	let startPointerX = 0;
	let startPointerY = 0;
	let startCardX = 0;
	let startCardY = 0;
	let lastPointerX = 0;
	let lastPointerY = 0;
	let lastTime = 0;

	let animFrame: number;

	// Dimensions of the scene
	const sceneWidth = 360;
	const sceneHeight = 540;
	const originX = sceneWidth / 2;
	const originY = 0;

	// Target equilibrium position
	const targetX = 0;
	const targetY = 130;

	// Clasp anchor point derived directly from card position
	let claspX = $derived(originX + cardX);
	let claspY = $derived(cardY - 26);

	// Dynamic ribbon paths that smoothly deform as card moves
	let leftRibbonPath = $derived.by(() => {
		const startX = originX - 18;
		const startY = originY;
		const endX = claspX - 4;
		const endY = claspY;
		const midX = (startX + endX) / 2 + cardX * 0.15;
		const midY = (startY + endY) / 2 + 10;
		return `M ${startX} ${startY} Q ${midX} ${midY}, ${endX} ${endY}`;
	});

	let rightRibbonPath = $derived.by(() => {
		const startX = originX + 18;
		const startY = originY;
		const endX = claspX + 4;
		const endY = claspY;
		const midX = (startX + endX) / 2 + cardX * 0.15;
		const midY = (startY + endY) / 2 + 10;
		return `M ${startX} ${startY} Q ${midX} ${midY}, ${endX} ${endY}`;
	});

	// Effective Y rotation combining flip state and tilt
	let effectiveRotY = $derived((isFlipped ? 180 : 0) + rotY);

	function onPointerDown(e: PointerEvent) {
		isDragging = true;
		startPointerX = e.clientX;
		startPointerY = e.clientY;
		lastPointerX = e.clientX;
		lastPointerY = e.clientY;
		startCardX = cardX;
		startCardY = cardY;
		vx = 0;
		vy = 0;
		lastTime = performance.now();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging) return;
		const now = performance.now();
		const dt = Math.max(now - lastTime, 16);

		const dx = e.clientX - startPointerX;
		const dy = e.clientY - startPointerY;

		// Move card with natural elastic resistance
		const nextX = Math.max(-100, Math.min(100, startCardX + dx * 0.7));
		const nextY = Math.max(90, Math.min(190, startCardY + dy * 0.6));

		// Calculate velocity for smooth fling release
		vx = (e.clientX - lastPointerX) / (dt / 16);
		vy = (e.clientY - lastPointerY) / (dt / 16);

		// Natural banking tilt when pulled sideways
		rotZ = nextX * 0.25;
		rotY = nextX * 0.2;
		rotX = (nextY - targetY) * 0.15;

		cardX = nextX;
		cardY = nextY;

		lastPointerX = e.clientX;
		lastPointerY = e.clientY;
		lastTime = now;
	}

	function onPointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {}
	}

	function onMouseMove(e: MouseEvent) {
		if (isDragging) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const relX = (e.clientX - rect.left) / rect.width - 0.5;
		const relY = (e.clientY - rect.top) / rect.height - 0.5;

		// Subtle natural 3D tilt tracking mouse
		rotY += (relX * 18 - rotY) * 0.15;
		rotX += (-relY * 14 - rotX) * 0.15;
		rotZ += (relX * 8 - rotZ) * 0.15;
	}

	function onMouseEnter() {
		isHovering = true;
	}

	function onMouseLeave() {
		isHovering = false;
	}

	function toggleFlip() {
		isFlipped = !isFlipped;
	}

	function resetCard() {
		isFlipped = false;
		cardX = 0;
		cardY = 130;
		rotX = 0;
		rotY = 0;
		rotZ = 0;
		vx = 0;
		vy = 0;
	}

	onMount(() => {
		let t = 0;
		function loop() {
			if (!isDragging) {
				// Damped harmonic spring physics for card position
				const k = 0.08;
				const damping = 0.88;

				const breathX = Math.sin(t * 0.02) * 2;
				const breathY = Math.sin(t * 0.03) * 2;

				const ax = -k * (cardX - (targetX + (isHovering ? breathX : 0)));
				const ay = -k * (cardY - (targetY + (isHovering ? breathY : 0)));

				vx = (vx + ax) * damping;
				vy = (vy + ay) * damping;

				cardX += vx;
				cardY += vy;

				// Return tilt angles to resting state when not hovering
				if (!isHovering) {
					rotX += (0 - rotX) * 0.08;
					rotY += (0 - rotY) * 0.08;
					rotZ += (cardX * 0.2 - rotZ) * 0.08;
				} else {
					rotZ += (cardX * 0.2 - rotZ) * 0.1;
				}

				t++;
			}
			animFrame = requestAnimationFrame(loop);
		}
		animFrame = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(animFrame);
		};
	});
</script>

<div class="relative flex w-full max-w-[380px] flex-col items-center select-none">
	<!-- Top Controls Pill -->
	<div class="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1018]/90 px-3.5 py-1.5 backdrop-blur-md shadow-lg shadow-black/50 font-sans">
		<button
			type="button"
			onclick={toggleFlip}
			class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white active:scale-95"
		>
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
				<path d="M3 3v5h5"/>
				<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
				<path d="M16 16h5v5"/>
			</svg>
			<span>{isFlipped ? 'Lihat Depan' : 'Putar Belakang'}</span>
		</button>

		<div class="h-3 w-px bg-white/15"></div>

		<button
			type="button"
			onclick={resetCard}
			class="rounded-full px-2 py-0.5 text-xs font-semibold text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200 active:scale-95"
		>
			Reset
		</button>

		<div class="h-3 w-px bg-white/15"></div>

		<span class="text-[11px] text-indigo-400/90 flex items-center gap-1 font-semibold">
			<span class="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
			Tarik Kartu
		</span>
	</div>

	<!-- 3D Hanging Viewport -->
	<div
		class="relative flex h-[540px] w-full items-start justify-center cursor-grab active:cursor-grabbing overflow-visible"
		style="perspective: 1000px;"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onmousemove={onMouseMove}
		onmouseenter={onMouseEnter}
		onmouseleave={onMouseLeave}
		role="region"
		aria-label="Kartu Identitas Pelajar 3D Interaktif"
	>
		<!-- ================= SVG DYNAMIC LANYARD RIBBON ================= -->
		<svg
			class="pointer-events-none absolute top-0 left-0 h-full w-full overflow-visible z-10"
			viewBox="0 0 {sceneWidth} {sceneHeight}"
		>
			<defs>
				<!-- Lanyard Fabric Gradient (Royal Indigo to Deep Slate) -->
				<linearGradient id="lanyard-texture" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="#0b0e17" />
					<stop offset="30%" stop-color="#312e81" />
					<stop offset="70%" stop-color="#4338ca" />
					<stop offset="100%" stop-color="#0b0e17" />
				</linearGradient>

				<!-- Drop shadow for the lanyard ribbon -->
				<filter id="lanyard-shadow" x="-30%" y="-10%" width="160%" height="130%">
					<feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.6"/>
				</filter>
			</defs>

			<!-- Left Ribbon Strap -->
			<path
				d={leftRibbonPath}
				fill="none"
				stroke="url(#lanyard-texture)"
				stroke-width="14"
				stroke-linecap="round"
				filter="url(#lanyard-shadow)"
			/>
			<!-- Left Ribbon Stitching Accent (Luminous Cyan) -->
			<path
				d={leftRibbonPath}
				fill="none"
				stroke="#38bdf8"
				stroke-opacity="0.45"
				stroke-width="1.5"
				stroke-dasharray="3 3"
			/>

			<!-- Right Ribbon Strap -->
			<path
				d={rightRibbonPath}
				fill="none"
				stroke="url(#lanyard-texture)"
				stroke-width="14"
				stroke-linecap="round"
				filter="url(#lanyard-shadow)"
			/>
			<!-- Right Ribbon Stitching Accent (Luminous Cyan) -->
			<path
				d={rightRibbonPath}
				fill="none"
				stroke="#38bdf8"
				stroke-opacity="0.45"
				stroke-width="1.5"
				stroke-dasharray="3 3"
			/>

			<!-- Metal Safety Breakaway Ring at top neck area -->
			<ellipse
				cx={originX}
				cy="10"
				rx="24"
				ry="6"
				fill="none"
				stroke="#64748b"
				stroke-width="2.5"
			/>
		</svg>

		<!-- ================= 3D CARD WRAPPER WITH PRESERVE-3D ================= -->
		<div
			class="relative flex flex-col items-center select-none will-change-transform"
			style="
				transform-origin: top center;
				transform-style: preserve-3d;
				transform: translate3d({cardX}px, {cardY}px, 0px) rotateZ({rotZ}deg) rotateX({rotX}deg);
				transition: {isDragging ? 'none' : 'transform 0.1s ease-out'};
			"
		>
			<!-- ================= METAL CLASP & SWIVEL HOOK ================= -->
			<div
				class="pointer-events-none absolute -top-[30px] z-30 flex flex-col items-center"
				style="transform-style: preserve-3d;"
			>
				<!-- Metal Crimp Bracket -->
				<div class="h-[10px] w-[20px] rounded-[2px] border border-zinc-500 bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-900 shadow flex items-center justify-center">
					<div class="h-[2px] w-[12px] bg-zinc-950 rounded-sm"></div>
				</div>

				<!-- Swivel Ring -->
				<div class="-mt-0.5 h-[12px] w-[14px] rounded-full border-[2px] border-zinc-400 bg-transparent"></div>

				<!-- Lobster Clasp Body -->
				<div class="-mt-1 h-[15px] w-[10px] rounded-[2px] border border-zinc-400 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 shadow-md"></div>

				<!-- Carabiner Hook looping into card punch-hole -->
				<div class="-mt-0.5 h-[14px] w-[16px] rounded-full border-[2.5px] border-zinc-300 border-b-transparent bg-transparent"></div>
			</div>

			<!-- ================= CARD ROTATION FLIP CONTAINER ================= -->
			<div
				class="relative transition-transform duration-500 ease-out"
				style="
					transform-style: preserve-3d;
					transform: rotateY({effectiveRotY}deg);
				"
			>
				<!-- ACRYLIC ID BADGE CASING -->
				<div
					class="relative h-[440px] w-[280px] rounded-[18px] p-2 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(99,102,241,0.25)] border border-white/20 backdrop-blur-xl"
					style="
						background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(15, 20, 32, 0.94) 45%, rgba(10, 12, 18, 0.98) 100%);
						transform-style: preserve-3d;
					"
				>
					<!-- Top Slot Punch Hole -->
					<div class="absolute -top-[1px] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
						<div class="h-[6px] w-[32px] rounded-full border border-white/25 bg-zinc-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"></div>
					</div>

					<!-- Dynamic Holographic Foil Sheen Overlay -->
					<div
						class="pointer-events-none absolute inset-0 rounded-[18px] z-30"
						style="
							background: linear-gradient({(rotY * 2.5 + 130)}deg, transparent 25%, rgba(99,102,241,0.22) 42%, rgba(6,182,212,0.3) 50%, rgba(236,72,153,0.22) 58%, transparent 75%);
							opacity: {Math.min(0.85, Math.max(0.2, (Math.abs(rotY) + Math.abs(rotX)) * 0.02 + 0.25))};
							mix-blend-mode: screen;
						"
					></div>

					<!-- Frosted Glass Rim -->
					<div class="pointer-events-none absolute inset-0 rounded-[18px] border border-white/10"></div>

					<!-- ================= FRONT FACE (OFFICIAL STUDENT CARD) ================= -->
					<div
						class="absolute inset-2 overflow-hidden rounded-[13px] bg-[#0b0e17] text-white shadow-2xl [backface-visibility:hidden] flex flex-col justify-between"
						style="transform: translateZ(4px); transform-style: preserve-3d;"
					>
						<!-- Card Header -->
						<div class="relative z-10 border-b border-white/10 bg-zinc-950/70 px-3 py-2.5 font-sans" style="transform: translateZ(12px);">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-1.5">
									<span class="inline-block h-2 w-2 rounded-full bg-indigo-400"></span>
									<span class="text-[9.5px] font-extrabold tracking-[1.5px] text-zinc-100 uppercase">
										SMK NEGERI 8 SEMARANG
									</span>
								</div>
								<span class="rounded bg-indigo-500/20 border border-indigo-500/40 px-1.5 py-0.5 text-[8px] font-bold text-indigo-300">
									PPLG
								</span>
							</div>
							<div class="mt-0.5 flex items-center justify-between text-[9px] font-medium text-zinc-400">
								<span>KARTU PELAJAR</span>
								<span class="text-zinc-500 font-mono text-[8px]">2024 — 2027</span>
							</div>
						</div>

						<!-- Card Body -->
						<div class="relative z-10 flex flex-1 flex-col p-3 justify-between font-sans" style="transform-style: preserve-3d;">
							<!-- Photo & Microchip Row -->
							<div class="flex items-start gap-2.5" style="transform-style: preserve-3d;">
								<!-- Student Photo with 3D Pop -->
								<div
									class="relative h-[110px] w-[90px] flex-shrink-0 overflow-hidden rounded-lg border border-white/20 bg-zinc-900 shadow-xl transition-transform"
									style="transform: translateZ(28px); box-shadow: 0 12px 24px -6px rgba(0,0,0,0.85);"
								>
									<img
										src="/images/id-card.jpg"
										alt="Foto Pelajar Ravidya Satrio Adi"
										class="h-full w-full object-cover object-[50%_25%]"
									/>
									<div class="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[7.5px] font-bold text-emerald-400">
										ACTIVE
									</div>
								</div>

								<!-- Microchip & Major Details with 3D Pop -->
								<div class="flex flex-1 flex-col gap-1.5" style="transform-style: preserve-3d;">
									<!-- Gold Smart Card Microchip with 3D Elevation -->
									<div
										class="relative h-[30px] w-[38px] overflow-hidden rounded-[4px] border border-amber-500/80 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md"
										style="transform: translateZ(36px); box-shadow: 0 8px 16px -4px rgba(0,0,0,0.7);"
									>
										<div class="h-full w-full border border-amber-800/40 grid grid-cols-2 grid-rows-3 gap-0.5">
											<div class="border-b border-r border-amber-900/40"></div>
											<div class="border-b border-amber-900/40"></div>
											<div class="border-b border-r border-amber-900/40"></div>
											<div class="border-b border-amber-900/40"></div>
											<div class="border-r border-amber-900/40"></div>
											<div></div>
										</div>
									</div>

									<!-- Class & Department -->
									<div class="flex flex-col mt-0.5" style="transform: translateZ(16px);">
										<span class="text-[8px] font-bold text-zinc-400 tracking-wider uppercase">KELAS & JURUSAN</span>
										<span class="text-[13px] font-extrabold text-white tracking-tight">
											{profile.class}
										</span>
										<span class="text-[9px] font-semibold text-cyan mt-0.5">
											Pengembangan Perangkat Lunak & Gim
										</span>
									</div>
								</div>
							</div>

							<!-- Student Name & NISN with 3D Pop -->
							<div class="mt-1.5 flex flex-col gap-0.5 border-t border-white/10 pt-2" style="transform: translateZ(22px);">
								<span class="text-[8px] font-bold uppercase tracking-wider text-zinc-400">NAMA LENGKAP</span>
								<span class="text-[14px] font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
									{profile.name}
								</span>
								<span class="text-[9px] text-zinc-400 mt-0.5">
									NISN: <span class="font-mono font-bold text-zinc-200">{profile.nisn}</span>
								</span>
							</div>

							<!-- Origin & Validity Meta with 3D Elevation -->
							<div class="mt-1 grid grid-cols-2 gap-1.5 rounded-lg bg-zinc-950/60 p-1.5 border border-white/5 text-[8.5px]" style="transform: translateZ(14px);">
								<div>
									<div class="text-[7.5px] font-semibold text-zinc-500 uppercase">TEMPAT, TGL LAHIR</div>
									<div class="text-zinc-200 font-medium truncate">{profile.birthplace}</div>
								</div>
								<div>
									<div class="text-[7.5px] font-semibold text-zinc-500 uppercase">MASA BERLAKU</div>
									<div class="text-zinc-200 font-medium font-mono text-[8px]">13/07/24 — 13/04/27</div>
								</div>
							</div>

							<!-- Barcode & Hologram Foil Seal with 3D Pop -->
							<div class="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5" style="transform-style: preserve-3d;">
								<!-- Barcode -->
								<div class="flex flex-col" style="transform: translateZ(16px);">
									<div class="flex h-[20px] items-end gap-[1.5px] bg-white px-1 py-0.5 rounded-[2px] shadow-sm">
										{#each [3,1,4,1,5,9,2,6,5,3,5,8,9,7,9,3,2,3,8,4,6,2,6] as bar}
											<div class="bg-black" style="width: {bar % 3 === 0 ? '3px' : bar % 2 === 0 ? '2px' : '1px'}; height: 100%;"></div>
										{/each}
									</div>
									<span class="mt-0.5 font-mono text-[6.5px] text-zinc-400 tracking-[1.5px]">0107348182-SMKN8</span>
								</div>

								<!-- Hologram Seal (Prismatic Indigo-Cyan) with 3D Pop -->
								<div
									class="relative h-[28px] w-[28px] rounded-full border border-indigo-400/80 shadow-lg flex items-center justify-center overflow-hidden"
									style="
										background: radial-gradient(circle at 40% 40%, #6366f1 0%, #06b6d4 50%, #ec4899 90%);
										transform: translateZ(32px);
										box-shadow: 0 6px 14px -2px rgba(99, 102, 241, 0.5);
									"
								>
									<span class="font-sans text-[7.5px] font-black text-white drop-shadow">SMK8</span>
								</div>
							</div>
						</div>
					</div>

					<!-- ================= BACK FACE (CREDENTIALS & GITHUB QR) ================= -->
					<div
						class="absolute inset-2 overflow-hidden rounded-[13px] bg-[#0b0e17] text-white shadow-2xl [backface-visibility:hidden] flex flex-col justify-between"
						style="transform: rotateY(180deg) translateZ(4px); transform-style: preserve-3d;"
					>
						<!-- Magnetic Stripe -->
						<div class="mt-2.5 h-[36px] w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-y border-zinc-800 relative flex items-center justify-end px-3" style="transform: translateZ(10px);">
							<span class="font-mono text-[7.5px] text-zinc-600 tracking-[2px]">
								SMK8-PPLG-0107348182
							</span>
						</div>

						<div class="p-3 flex flex-col flex-1 justify-between" style="transform-style: preserve-3d;">
							<!-- Signature Strip -->
							<div class="flex items-center gap-2" style="transform: translateZ(20px);">
								<div class="h-[26px] flex-1 rounded bg-zinc-200 px-2 flex items-center justify-between text-black">
									<span class="font-serif italic text-xs text-zinc-800 font-bold">Ravidya Satrio Adi</span>
									<span class="font-mono text-[7.5px] font-bold text-zinc-600">SMKN 8</span>
								</div>
								<div class="h-[26px] w-[36px] rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono text-[9px] text-indigo-400 font-bold" style="transform: translateZ(28px);">
									734
								</div>
							</div>

							<!-- QR Code for GitHub Access with 3D Pop -->
							<div class="my-1.5 flex items-center gap-2.5 rounded-lg border border-white/10 bg-zinc-950/60 p-2 shadow-lg" style="transform: translateZ(28px);">
								<div class="h-[56px] w-[56px] flex-shrink-0 bg-white p-1 rounded shadow-md">
									<svg viewBox="0 0 29 29" class="h-full w-full" fill="black">
										<rect x="0" y="0" width="7" height="7"/>
										<rect x="1" y="1" width="5" height="5" fill="white"/>
										<rect x="2" y="2" width="3" height="3"/>
										<rect x="22" y="0" width="7" height="7"/>
										<rect x="23" y="1" width="5" height="5" fill="white"/>
										<rect x="24" y="2" width="3" height="3"/>
										<rect x="0" y="22" width="7" height="7"/>
										<rect x="1" y="23" width="5" height="5" fill="white"/>
										<rect x="2" y="24" width="3" height="3"/>
										<rect x="9" y="2" width="2" height="3"/>
										<rect x="13" y="1" width="3" height="2"/>
										<rect x="17" y="3" width="2" height="2"/>
										<rect x="10" y="10" width="4" height="4"/>
										<rect x="16" y="12" width="3" height="3"/>
										<rect x="2" y="10" width="3" height="3"/>
										<rect x="6" y="15" width="2" height="4"/>
										<rect x="12" y="18" width="5" height="2"/>
										<rect x="20" y="17" width="4" height="4"/>
										<rect x="24" y="10" width="3" height="4"/>
										<rect x="10" y="24" width="4" height="3"/>
									</svg>
								</div>
								<div class="flex flex-col font-mono text-[8px] leading-relaxed text-zinc-300">
									<span class="font-bold text-white">GITHUB REPOSITORY</span>
									<span class="text-indigo-400">@Rapyas-kece</span>
									<span class="text-zinc-500 text-[7px] mt-0.5">Pindai untuk melihat repositori proyek.</span>
								</div>
							</div>

							<!-- School Address Footer -->
							<div class="border-t border-white/10 pt-1.5 font-mono text-[7px] text-zinc-500 leading-normal" style="transform: translateZ(10px);">
								<div>SMK NEGERI 8 SEMARANG</div>
								<div>Jl. Pandanaran II No. 12, Mugassari, Semarang Selatan</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
