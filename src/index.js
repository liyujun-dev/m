import INDEX_HTML from './index.html';

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
    if (url.pathname === '/') {
      return new Response(INDEX_HTML, { headers: { 'Content-Type': 'text/html' } });
    }
    if (url.pathname === '/v2/') {
      return Response.json({});
    }

    url.hostname = 'registry-1.docker.io';
    if (!url.pathname.startsWith('/v2/library') && !url.pathname.startsWith('/v2/docker.io')) {
      const registry = url.pathname.split('/')[2];
      if (registry.includes(".")) {
        url.hostname = registry;
        url.pathname = url.pathname.replace(`${registry}/`, '');
      }
    }
    if (url.pathname.startsWith('/v2/docker.io')) {
      url.pathname = url.pathname.replace('docker.io/', '');
    }

    const req = new Request(url, request);
    let res = await fetch(req);
    if (res.headers.get('Www-Authenticate')) {
      const [_, realm, service, scope] = res.headers
        .get('Www-Authenticate')
        .match(/Bearer realm="([^"]+)",service="([^"]+)",scope="([^"]+)"/);
      const auth = await fetch(new Request(`${realm}?service=${service}&scope=${scope}`));
      if (auth.status === 200) {
        const { token } = await auth.json();
        req.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    res = await fetch(req);
    if (res.headers.get('Location')) {
      res = await fetch(new Request(res.headers.get('Location'), req), { redirect: 'follow' });
    }
    return res;
  },
};
