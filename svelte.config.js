import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html'  // 👈 important for SPAs on GitHub Pages
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/Tic-Tac-Toe' : ''
		}
	}
};

export default config;
