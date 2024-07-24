import INDEX_HTML from './index.html';

/** @type {string[]} */
const registries = ['registry-1.docker.io', 'quay.io', 'ghcr.io', 'gcr.io', 'registry.k8s.io'];

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
    console.log(url);
    const workerUrl = `https://${url.hostname}/`;
    if (url.pathname === '/') {
      return new Response(INDEX_HTML, { headers: { 'Content-Type': 'text/html' } });
    }
    if (url.searchParams.has('scope') || url.searchParams.has('service')) {
      const [_, authHostname, ...authPathname] = url.pathname.split('/');
      url.hostname = authHostname;
      url.pathname = authPathname.join('/');
      return await fetch(new Request(url.href, request));
    }

    if (url.pathname.startsWith('/v2') && url.pathname.includes('.')) {
      url.pathname = url.pathname.replace('/v2', '');
    }

    const registry = registries.find((r) => url.pathname.startsWith(`/${r}`)) ?? registries[0];
    url.hostname = registry;
    url.pathname = url.pathname.replace(`/${registry}`, '');
    console.log(url);
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
