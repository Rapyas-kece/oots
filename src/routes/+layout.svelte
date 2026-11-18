<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Ravidya Satrio Adi — Security Researcher & Developer</title>
	<meta name="description" content="Portofolio Ravidya Satrio Adi - Siswa SMK N 8 Semarang Jurusan PPLG. Web Exploitation, SvelteKit, and Systems." />
</svelte:head>

{@render children()}
