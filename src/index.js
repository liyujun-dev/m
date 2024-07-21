import INDEX_HTML from './index.html';

export default {
  async fetch(request, env, ctx) {
    if (request.headers.get('Accept')?.includes('html')) {
      return new Response(INDEX_HTML, {
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
        },
      });
    }
    console.log(request);
    return Response.json({ message: 'ok' });
  },
};
