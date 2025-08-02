import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), SvelteKitPWA({
		registerType: 'autoUpdate',
		strategies: 'generateSW',
		manifest: {
			name: 'Stock Screener',
			short_name: 'stock-screener',
			icons: [
				{
					src: '/icons/android-chrome-192x192.png',
					sizes: '192x192',
					type: 'image/png'
				},
				{
					src: '/icons/android-chrome-512x512.png',
					sizes: '512x512',
					type: 'image/png'
				}
			]
		},
		devOptions: {
			enabled: true
		}
	}),]
});
