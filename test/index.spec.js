import { describe, it, expect } from 'vitest';
import worker from '../src';

it.skip('hello', async () => {
  const res = await fetch('https://example.com/');
  expect(res.status).toEqual(200);
  expect(await res.text()).toMatchSnapshot();
});

it.skip('Pull image from docker hub', async () => {
  const headers = new Headers({
    'accept-encoding': 'gzip, br',
    'user-agent':
      'docker/24.0.7 go/go1.20.10 git-commit/311b9ff kernel/6.6.9-200.fc39.x86_64 os/linux arch/amd64 UpstreamClient(Docker-Client/24.0.7 \\(linux\\))',
  });
  const v2Req = new Request('https://example.com/v2/', { headers });
  const v2Res = await worker.fetch(v2Req);
  expect(v2Res.status).toEqual(401);
  expect(v2Res.headers.get('Www-Authenticate')).toMatchSnapshot();

  const tokenReq = new Request(
    'https://example.com/auth.docker.io/token/?scope=repository%3Alibrary%2Falpine%3Apull&service=registry.docker.io',
    { headers }
  );
  const tokenRes = await worker.fetch(tokenReq);
  expect(tokenRes.status).toEqual(200);
  const tokenResult = await tokenRes.json();
  expect(tokenResult).toHaveProperty('access_token');
  expect(tokenResult).toHaveProperty('expires_in');
  expect(tokenResult).toHaveProperty('issued_at');
  expect(tokenResult).toHaveProperty('token');

  const manifestReq = new Request('https://example.com/v2/library/alpine/manifests/latest', {
    headers: {
      ...headers,
      Authorization: `Bearer ${tokenResult.access_token}`,
    },
  });
  const manifestRes = await worker.fetch(manifestReq);
  expect(manifestRes.status).toEqual(200);
  const manifestResult = await manifestRes.json();
  expect(manifestResult).toHaveProperty('name');
  expect(manifestResult).toHaveProperty('fsLayers');
  expect(manifestResult).toHaveProperty('history');
  expect(manifestResult).toHaveProperty('tag');
});

it('Pull image from quay.io', async () => {
  const headers = new Headers({
    'accept-encoding': 'gzip, br',
    'user-agent':
      'docker/24.0.7 go/go1.20.10 git-commit/311b9ff kernel/6.6.9-200.fc39.x86_64 os/linux arch/amd64 UpstreamClient(Docker-Client/24.0.7 \\(linux\\))',
  });
  const v2Req = new Request('https://example.com/v2/quay.io', { headers });
  const v2Res = await worker.fetch(v2Req);
  expect(v2Res.status).toEqual(200);

  const manifestReq = new Request('https://example.com/v2/quay.io/v2/minio/minio/manifests/latest', { headers });
  const manifestRes = await worker.fetch(manifestReq);
  expect(manifestRes.status).toEqual(200);
  const manifestResult = await manifestRes.json();
  expect(manifestResult).toHaveProperty('name');
  expect(manifestResult).toHaveProperty('fsLayers');
  expect(manifestResult).toHaveProperty('history');
  expect(manifestResult).toHaveProperty('tag');
});
