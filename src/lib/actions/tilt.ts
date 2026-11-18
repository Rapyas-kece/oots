import type { Action } from 'svelte/action';

export interface TiltOptions {
	max?: number;
	perspective?: number;
	scale?: number;
	speed?: number;
	glare?: boolean;
	maxGlare?: number;
}

export const tilt: Action<HTMLElement, TiltOptions | undefined> = (node, options = {}) => {
	const max = options.max ?? 10;
	const perspective = options.perspective ?? 1000;
	const scale = options.scale ?? 1.02;
	const speed = options.speed ?? 400;
	const glare = options.glare ?? true;
	const maxGlare = options.maxGlare ?? 0.25;

	// Check reduced motion
	const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (mediaQuery.matches) {
		return;
	}

	let glareElement: HTMLElement | null = null;
	if (glare) {
		glareElement = document.createElement('div');
		glareElement.style.position = 'absolute';
		glareElement.style.inset = '0';
		glareElement.style.pointerEvents = 'none';
		glareElement.style.borderRadius = 'inherit';
		glareElement.style.zIndex = '5';
		glareElement.style.opacity = '0';
		glareElement.style.transition = `opacity ${speed}ms ease-out`;
		glareElement.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 75%)';
		node.style.position = 'relative';
		node.style.overflow = 'hidden';
		node.appendChild(glareElement);
	}

	node.style.transformStyle = 'preserve-3d';
	node.style.willChange = 'transform';
	node.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;

	function handleMouseMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const percentX = (x - centerX) / centerX;
		const percentY = (y - centerY) / centerY;

		const rotX = -percentY * max;
		const rotY = percentX * max;

		node.style.transition = 'none';
		node.style.transform = `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

		if (glareElement) {
			glareElement.style.opacity = `${(Math.hypot(percentX, percentY) * maxGlare).toFixed(3)}`;
			glareElement.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.22) 0%, rgba(99, 102, 241, 0.12) 35%, transparent 70%)`;
		}
	}

	function handleMouseLeave() {
		node.style.transition = `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
		node.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
		if (glareElement) {
			glareElement.style.transition = `opacity ${speed}ms ease-out`;
			glareElement.style.opacity = '0';
		}
	}

	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
			if (glareElement && glareElement.parentNode === node) {
				node.removeChild(glareElement);
			}
		}
	};
};
