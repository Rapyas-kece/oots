<script lang="ts">
	import { onMount } from 'svelte';

	type GeometryMode = 'icosahedron' | 'torus' | 'sphere';

	let canvas: HTMLCanvasElement | undefined = $state();
	let currentMode = $state<GeometryMode>('icosahedron');
	let isDragging = $state(false);
	let autoRotate = $state(true);
	let fps = $state(60);
	let shockwaveActive = $state(false);

	// 3D Rotation angles & velocities
	let rotX = $state(0.4);
	let rotY = $state(0.6);
	let rotZ = $state(0);
	let velX = 0;
	let velY = 0.006;
	let startPointerX = 0;
	let startPointerY = 0;

	// Shockwave pulse factor
	let pulseScale = 1;

	type Point3D = { x: number; y: number; z: number };
	type Point2D = { x: number; y: number; scale: number; alpha: number };

	// 1. Generate Icosahedron vertices & edges
	function createIcosahedron(): { vertices: Point3D[]; edges: [number, number][] } {
		const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio: 1.618
		const r = 110;
		const a = r / Math.sqrt(1 + phi * phi);
		const b = a * phi;

		const vertices: Point3D[] = [
			{ x: -a, y: b, z: 0 },
			{ x: a, y: b, z: 0 },
			{ x: -a, y: -b, z: 0 },
			{ x: a, y: -b, z: 0 },
			{ x: 0, y: -a, z: b },
			{ x: 0, y: a, z: b },
			{ x: 0, y: -a, z: -b },
			{ x: 0, y: a, z: -b },
			{ x: b, y: 0, z: -a },
			{ x: b, y: 0, z: a },
			{ x: -b, y: 0, z: -a },
			{ x: -b, y: 0, z: a }
		];

		const edges: [number, number][] = [];
		for (let i = 0; i < vertices.length; i++) {
			for (let j = i + 1; j < vertices.length; j++) {
				const dx = vertices[i].x - vertices[j].x;
				const dy = vertices[i].y - vertices[j].y;
				const dz = vertices[i].z - vertices[j].z;
				const dist = Math.hypot(dx, dy, dz);
				// Connect nearest neighbors (standard edge length of icosahedron)
				if (dist < 2 * a * 1.1) {
					edges.push([i, j]);
				}
			}
		}
		return { vertices, edges };
	}

	// 2. Generate Torus Knot
	function createTorusKnot(): { vertices: Point3D[]; edges: [number, number][] } {
		const p = 2;
		const q = 3;
		const segments = 120;
		const vertices: Point3D[] = [];
		const edges: [number, number][] = [];

		for (let i = 0; i < segments; i++) {
			const theta = (i / segments) * Math.PI * 2;
			const r = 40 * Math.cos(q * theta) + 90;
			const x = r * Math.cos(p * theta);
			const y = r * Math.sin(p * theta);
			const z = -45 * Math.sin(q * theta);
			vertices.push({ x, y, z });
			edges.push([i, (i + 1) % segments]);
		}
		return { vertices, edges };
	}

	// 3. Generate Geodesic Sphere
	function createSphere(): { vertices: Point3D[]; edges: [number, number][] } {
		const vertices: Point3D[] = [];
		const edges: [number, number][] = [];
		const rings = 8;
		const pointsPerRing = 16;
		const radius = 105;

		for (let i = 0; i <= rings; i++) {
			const phi = (i / rings) * Math.PI;
			for (let j = 0; j < pointsPerRing; j++) {
				const theta = (j / pointsPerRing) * Math.PI * 2;
				const x = radius * Math.sin(phi) * Math.cos(theta);
				const y = radius * Math.cos(phi);
				const z = radius * Math.sin(phi) * Math.sin(theta);
				const currIdx = vertices.length;
				vertices.push({ x, y, z });

				// Longitudinal edge
				if (j > 0) edges.push([currIdx, currIdx - 1]);
				if (j === pointsPerRing - 1) edges.push([currIdx, currIdx - pointsPerRing + 1]);
				// Latitudinal edge
				if (i > 0) edges.push([currIdx, currIdx - pointsPerRing]);
			}
		}
		return { vertices, edges };
	}

	// Ambient Particle Cloud in 3D Space
	const particleCount = 140;
	const particles: Point3D[] = [];
	for (let i = 0; i < particleCount; i++) {
		const u = Math.random();
		const v = Math.random();
		const theta = u * 2.0 * Math.PI;
		const phi = Math.acos(2.0 * v - 1.0);
		const r = 130 + Math.random() * 80;
		particles.push({
			x: r * Math.sin(phi) * Math.cos(theta),
			y: r * Math.sin(phi) * Math.sin(theta),
			z: r * Math.cos(phi)
		});
	}

	function project3D(p: Point3D, cx: number, cy: number, fov = 380): Point2D {
		// 3D Rotation matrices
		// 1. Rotate Y
		const cosY = Math.cos(rotY);
		const sinY = Math.sin(rotY);
		const x1 = p.x * cosY + p.z * sinY;
		const y1 = p.y;
		const z1 = -p.x * sinY + p.z * cosY;

		// 2. Rotate X
		const cosX = Math.cos(rotX);
		const sinX = Math.sin(rotX);
		const x2 = x1;
		const y2 = y1 * cosX - z1 * sinX;
		const z2 = y1 * sinX + z1 * cosX;

		// 3. Perspective projection
		const zPerspective = z2 + fov;
		const scale = fov / Math.max(10, zPerspective);
		const alpha = Math.max(0.1, Math.min(1, (z2 + 180) / 360));

		return {
			x: cx + x2 * scale * pulseScale,
			y: cy + y2 * scale * pulseScale,
			scale,
			alpha
		};
	}

	function triggerShockwave() {
		if (shockwaveActive) return;
		shockwaveActive = true;
		let frame = 0;
		const shock = () => {
			frame++;
			pulseScale = 1 + Math.sin(frame * 0.15) * 0.22 * Math.max(0, 1 - frame / 24);
			if (frame < 24) {
				requestAnimationFrame(shock);
			} else {
				pulseScale = 1;
				shockwaveActive = false;
			}
		};
		shock();
	}

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		startPointerX = e.clientX;
		startPointerY = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		const dx = e.clientX - startPointerX;
		const dy = e.clientY - startPointerY;

		rotY += dx * 0.008;
		rotX += dy * 0.008;

		velX = dy * 0.002;
		velY = dx * 0.002;

		startPointerX = e.clientX;
		startPointerY = e.clientY;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {}
	}

	onMount(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animId: number;
		let lastTime = performance.now();
		let frameCounter = 0;
		let lastFpsUpdate = lastTime;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		const resize = () => {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
		};
		resize();
		window.addEventListener('resize', resize);

		const render = (time: number) => {
			frameCounter++;
			if (time - lastFpsUpdate >= 1000) {
				fps = Math.round((frameCounter * 1000) / (time - lastFpsUpdate));
				frameCounter = 0;
				lastFpsUpdate = time;
			}

			const dt = Math.min(time - lastTime, 50);
			lastTime = time;

			if (!isDragging) {
				if (autoRotate) {
					rotY += 0.007;
					rotX += Math.sin(time * 0.001) * 0.002;
				} else {
					rotX += velX;
					rotY += velY;
					velX *= 0.95;
					velY *= 0.95;
				}
			}

			const w = canvas!.width;
			const h = canvas!.height;
			ctx.clearRect(0, 0, w, h);

			const cx = w / 2;
			const cy = h / 2;
			const baseFov = 380 * dpr;

			// Draw ambient background 3D particles
			for (let i = 0; i < particles.length; i++) {
				const proj = project3D(particles[i], cx, cy, baseFov);
				const radius = Math.max(0.8, 1.8 * proj.scale * dpr);
				ctx.beginPath();
				ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(99, 102, 241, ${proj.alpha * 0.45})`;
				ctx.fill();
			}

			// Select active 3D geometry
			const model =
				currentMode === 'torus'
					? createTorusKnot()
					: currentMode === 'sphere'
						? createSphere()
						: createIcosahedron();

			// Project all model vertices to 2D
			const projected = model.vertices.map((v) => project3D(v, cx, cy, baseFov));

			// Draw 3D Edges with depth-based luminescence
			ctx.lineWidth = 1.4 * dpr;
			for (const [startIdx, endIdx] of model.edges) {
				const p1 = projected[startIdx];
				const p2 = projected[endIdx];
				const avgAlpha = (p1.alpha + p2.alpha) / 2;

				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);

				// Gradient stroke between Indigo & Cyan
				const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
				grad.addColorStop(0, `rgba(99, 102, 241, ${avgAlpha * 0.85})`);
				grad.addColorStop(0.5, `rgba(6, 182, 212, ${avgAlpha * 0.95})`);
				grad.addColorStop(1, `rgba(99, 102, 241, ${avgAlpha * 0.85})`);

				ctx.strokeStyle = grad;
				ctx.stroke();
			}

			// Draw 3D Vertex Nodes
			for (let i = 0; i < projected.length; i++) {
				const p = projected[i];
				const nodeRadius = Math.max(1.5, 3.8 * p.scale * dpr);

				// Outer halo glow
				ctx.beginPath();
				ctx.arc(p.x, p.y, nodeRadius * 2.2, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.25})`;
				ctx.fill();

				// Solid core vertex
				ctx.beginPath();
				ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
				ctx.fillStyle = p.alpha > 0.6 ? '#ffffff' : `rgba(165, 180, 252, ${p.alpha})`;
				ctx.fill();
			}

			// Inner energy pulse nucleus
			const nucleusRadius = (16 + Math.sin(time * 0.005) * 4) * dpr * pulseScale;
			const nucGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucleusRadius * 2);
			nucGrad.addColorStop(0, 'rgba(99, 102, 241, 0.55)');
			nucGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.25)');
			nucGrad.addColorStop(1, 'transparent');
			ctx.fillStyle = nucGrad;
			ctx.beginPath();
			ctx.arc(cx, cy, nucleusRadius * 2, 0, Math.PI * 2);
			ctx.fill();

			animId = requestAnimationFrame(render);
		};

		animId = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<div class="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#0c0f1c] via-[#090b14] to-[#06070c] p-6 shadow-2xl backdrop-blur-xl">
	<!-- Corner Technical Crosshairs -->
	<span class="absolute top-2 left-2 text-[10px] text-zinc-600 font-mono">+</span>
	<span class="absolute top-2 right-2 text-[10px] text-zinc-600 font-mono">+</span>
	<span class="absolute bottom-2 left-2 text-[10px] text-zinc-600 font-mono">+</span>
	<span class="absolute bottom-2 right-2 text-[10px] text-zinc-600 font-mono">+</span>

	<!-- Top Telemetry Header -->
	<div class="flex items-center justify-between border-b border-white/10 pb-3 mb-2 font-sans">
		<div class="flex items-center gap-2">
			<span class="flex h-2 w-2 relative">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
			</span>
			<span class="text-xs font-bold text-white tracking-wide">3D Spatial Geometry Matrix</span>
		</div>
		<div class="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
			<span>{fps} FPS</span>
			<span>•</span>
			<span class="text-indigo-400">MATH 3D ENGINE</span>
		</div>
	</div>

	<!-- Interactive 3D Canvas Viewport -->
	<div
		class="relative h-[320px] sm:h-[360px] w-full cursor-grab active:cursor-grabbing flex items-center justify-center"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
		role="region"
		aria-label="Interactive 3D Geometric Matrix Core"
	>
		<canvas bind:this={canvas} class="h-full w-full block"></canvas>

		<!-- Subtitle drag hint -->
		<div class="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-sans font-medium text-zinc-300 backdrop-blur-md">
			<span>Geser untuk memutar 3D · Klik pulse</span>
		</div>
	</div>

	<!-- Bottom Control Station -->
	<div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-sans text-xs">
		<!-- Geometry Mode Selector -->
		<div class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1">
			<button
				type="button"
				onclick={() => (currentMode = 'icosahedron')}
				class="rounded-full px-3 py-1 font-semibold transition {currentMode === 'icosahedron' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}"
			>
				Icosahedron
			</button>
			<button
				type="button"
				onclick={() => (currentMode = 'torus')}
				class="rounded-full px-3 py-1 font-semibold transition {currentMode === 'torus' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}"
			>
				Torus Knot
			</button>
			<button
				type="button"
				onclick={() => (currentMode = 'sphere')}
				class="rounded-full px-3 py-1 font-semibold transition {currentMode === 'sphere' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}"
			>
				Quantum Sphere
			</button>
		</div>

		<!-- Action triggers -->
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={triggerShockwave}
				class="flex items-center gap-1.5 rounded-xl border border-cyan/40 bg-cyan/10 px-3.5 py-1.5 text-cyan font-semibold hover:bg-cyan/20 active:scale-95 transition shadow-sm"
			>
				<span>⚡ Shockwave Pulse</span>
			</button>
			<button
				type="button"
				onclick={() => (autoRotate = !autoRotate)}
				class="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-white/10 font-semibold active:scale-95 transition"
			>
				{autoRotate ? 'Jeda Putar' : 'Putar Otomatis'}
			</button>
		</div>
	</div>
</div>
