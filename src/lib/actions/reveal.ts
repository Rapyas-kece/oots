import type { Action } from 'svelte/action';

export interface RevealOptions {
	delay?: number;
	duration?: number;
	distance?: number;
	blur?: number;
	threshold?: number;
	once?: boolean;
	type?: 'text' | 'heading' | 'card' | 'badge';
}

/**
 * Svelte Action for Scroll Reveal Animations
 * Smoothly reveals typography, headings, and cards as they scroll into view (both up and down).
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	let {
		delay = 0,
		duration = 750,
		distance = 24,
		blur = 8,
		threshold = 0.12,
		once = false,
		type = 'text'
	} = options;

	// Check prefers-reduced-motion
	if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.style.opacity = '1';
		return;
	}

	node.classList.add('scroll-reveal-init');
	node.style.setProperty('--reveal-delay', `${delay}ms`);
	node.style.setProperty('--reveal-duration', `${duration}ms`);
	node.style.setProperty('--reveal-distance', `${distance}px`);
	node.style.setProperty('--reveal-blur', `${blur}px`);

	if (type === 'heading') {
		node.classList.add('scroll-reveal-heading');
	} else if (type === 'card') {
		node.classList.add('scroll-reveal-card');
	} else if (type === 'badge') {
		node.classList.add('scroll-reveal-badge');
	} else {
		node.classList.add('scroll-reveal-text');
	}

	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('is-revealed');
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-revealed');
					if (once) {
						observer.unobserve(node);
					}
				} else {
					if (!once) {
						node.classList.remove('is-revealed');
					}
				}
			}
		},
		{
			threshold,
			rootMargin: '0px 0px -40px 0px'
		}
	);

	observer.observe(node);

	return {
		update(newOptions = {}) {
			delay = newOptions.delay ?? delay;
			duration = newOptions.duration ?? duration;
			distance = newOptions.distance ?? distance;
			blur = newOptions.blur ?? blur;
			threshold = newOptions.threshold ?? threshold;
			once = newOptions.once ?? once;
			type = newOptions.type ?? type;

			node.style.setProperty('--reveal-delay', `${delay}ms`);
			node.style.setProperty('--reveal-duration', `${duration}ms`);
			node.style.setProperty('--reveal-distance', `${distance}px`);
			node.style.setProperty('--reveal-blur', `${blur}px`);
		},
		destroy() {
			observer.disconnect();
		}
	};
};
