import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html' // <-- make SPA, serve index.html for all routes
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/Tic-Tac-Toe' : ''
		}
	}
};

export default config;
