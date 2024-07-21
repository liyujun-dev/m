import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Hello World worker', () => {
  it('responds with index html! (unit style)', async () => {
    const request = new Request('http://example.com', { headers: { Accept: 'text/html' } });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(await response.text()).toMatchInlineSnapshot(`
			"<!DOCTYPE html>
			<html>
			<head>
			<title>Welcome to nginx!</title>
			<style>
			html { color-scheme: light dark; }
			body { width: 35em; margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif; }
			</style>
			</head>
			<body>
			<h1>Welcome to nginx!</h1>
			<p>If you see this page, the nginx web server is successfully installed and
			working. Further configuration is required.</p>

			<p>For online documentation and support please refer to
			<a href="http://nginx.org/">nginx.org</a>.<br/>
			Commercial support is available at
			<a href="http://nginx.com/">nginx.com</a>.</p>

			<p><em>Thank you for using nginx.</em></p>
			</body>
			</html>
			"
		`);
  });
});
