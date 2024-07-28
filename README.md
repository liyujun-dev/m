# m

![deploy](../../actions/workflows/deploy.yaml/badge.svg)

Pulling images from any container registry using Cloudflare Worker.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/liyujun-dev/m)

## How to use

### One-time use

```bash
# Original pull command
docker pull alpine:3.20.2

# Current pull command
docker pull your-domain.com/library/alpine:3.20.2
# Or adding `docker.io`
docker pull your-domain.com/docker.io/library/alpine:3.20.2

# Add your domain prefix to pull from others container registries
docker pull your-domain.com/registry.k8s.io/pause:3.9
docker pull your-domain.com/ghcr.io/fatedier/frps:v0.59.0
docker pull your-domain.com/mcr.microsoft.com/devcontainers/javascript-node:1-18
docker pull your-domain.com/quay.io/prometheus/busybox:latest
docker pull your-domain.com/docker.elastic.co/elasticsearch/elasticsearch:7.17.9
```

### Global Configuration

Add your domain to the Docker daemon configuration.

> [!NOTE]
>
> See [Docker daemon configuration overview](https://docs.docker.com/config/daemon/).

```json
{
  "registry-mirrors": ["https://your-domain.com"]
}
```

## References

This repository is inspired by these projects. Thanks.

- DaoCloud's [crproxy](https://github.com/DaoCloud/crproxy)
- ciiiii's [cloudflare-docker-proxy
  ](https://github.com/ciiiii/cloudflare-docker-proxy)
- mzzsfy's [cf-worker](https://github.com/mzzsfy/Dockerfile/blob/main/cf-worker/README.md)
