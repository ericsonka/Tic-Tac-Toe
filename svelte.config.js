import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options
			pages: 'build',
			assets: 'build',
			fallback: 'index.html' // important for SPA-style routing
		}),
		paths: {
			// If your repo is github.com/username/repo
			base: dev ? '' : '/Tic-Tac-Toe'
		}
	}
};

export default config;
