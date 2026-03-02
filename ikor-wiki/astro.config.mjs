// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Ikor Bot Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/razvanbackpack/ikor-bot' }],
			sidebar: [
				{
					label: 'About',
					autogenerate: {	directory: 'about' }
					// items: [
					// 	// Each item here is one entry in the navigation menu.
					// 	{ label: 'Example Guide', slug: 'about/about' },
					// ],
				},
				{
					label: 'Code',
					autogenerate: {	directory: 'code' }
				}
			],
		}),
	],
});
