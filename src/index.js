import INDEX_HTML from './index.html';

export default {
	async fetch(request, env, ctx) {
		return new Response(
		  INDEX_HTML,
		  {
		    headers: {
		      'Content-Type': 'text/html; charset=UTF-8'
		    }
		  }
		);
	},
};
