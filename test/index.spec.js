import { describe, it, expect, test } from 'vitest';
import worker from '../src';

const BASE_URL = 'https://example.com';

it('hello', async () => {
  const res = await worker.fetch(new Request(BASE_URL));
  expect(res.status).toEqual(200);
  expect(await res.text()).toMatchSnapshot();
});

it('access /v2/ always returns 200', async () => {
  const res = await worker.fetch(new Request(`${BASE_URL}/v2/`));
  expect(res.status).toEqual(200);
  expect(await res.json()).toEqual({});
});

const headers = new Headers({
  Accept:
    'application/json, application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.v1+prettyjws',
  'Accept-Encoding': 'br, gzip',
  'User-Agent':
    'docker/24.0.7 go/go1.20.10 git-commit/311b9ff kernel/6.6.9-200.fc39.x86_64 os/linux arch/amd64 UpstreamClient(Docker-Client/24.0.7 \\(linux\\))',
});

/** @type {{repo: string, image: string, tag: string}[]} */
const images = [
  {
    repo: 'library',
    image: 'alpine',
    tag: '3.20.2',
  },
  {
    repo: 'docker.io/library',
    image: 'alpine',
    tag: '3.20.2',
  },
  {
    repo: 'quay.io/prometheus',
    image: 'busybox',
    tag: 'latest',
  },
  {
    repo: 'registry.k8s.io',
    image: 'pause',
    tag: '3.9',
  },
  {
    repo: 'registry.k8s.io/ingress-nginx',
    image: 'controller',
    tag: 'v1.11.1',
  },
  {
    repo: 'docker.elastic.co/elasticsearch',
    image: 'elasticsearch',
    tag: '7.17.9',
  },
  {
    repo: 'ghcr.io/fatedier',
    image: 'frps',
    tag: 'v0.59.0',
  },
  {
    repo: 'mcr.microsoft.com/devcontainers',
    image: 'javascript-node',
    tag: '1-18',
  },
];

describe.each(images)('pull $image with $tag from $repo', async ({ repo, image, tag }) => {
  it('head manifest', async () => {
    const res = await worker.fetch(new Request(`${BASE_URL}/v2/${repo}/${image}/manifests/${tag}`, { headers, method: 'HEAD' }));
    expect(res.status).toEqual(200);
  });
  it('get manifest', async () => {
    const res = await worker.fetch(new Request(`${BASE_URL}/v2/${repo}/${image}/manifests/${tag}`, { headers }));
    expect(res.status).toEqual(200);
    expect(await res.json()).toMatchSnapshot();
  });
});
