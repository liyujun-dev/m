import INDEX_HTML from './index.html';

/** @type {string[]} */
const registries = ['registry-1.docker.io'];

export default {
  /**
   * Asynchronously fetches data based on the request and environment.
   *
   * @param {Request} request - The request object for fetching data.
   * @param {Object} env - The environment settings.
   * @param {Object} ctx - The context of the fetch operation.
   * @return {Promise<Response>} The response object containing the fetched data.
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const workerUrl = `https://${url.hostname}/`;
    const registry = registries[0];

    if (url.pathname === '/') {
      return new Response(INDEX_HTML, { headers: { 'Content-Type': 'text/html' } });
    }
    if (url.searchParams.has('scope') || url.searchParams.has('service')) {
      const [_, authHostname, authPathname] = url.pathname.split('/');
      url.hostname = authHostname;
      url.pathname = authPathname;
      return await fetch(new Request(url.href, request));
    }

    url.hostname = registry;
    const res = await fetch(new Request(url, request));
    if (res.headers.get('Www-Authenticate')) {
      return new Response(res.body, {
        status: res.status,
        headers: {
          ...res.headers,
          'Www-Authenticate': res.headers.get('Www-Authenticate').replace(/https?:\/\//, workerUrl),
        },
      });
    }
    return res;
  },
};
