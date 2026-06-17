#!/usr/bin/env sh

set -e

docker rm -f nuxt-auth-utils-demo_distroless || true
docker rmi nuxt-auth-utils-demo_distroless || true

docker build \
--build-arg ENV_FILE=local.env \
--file ./docker/distroless/Dockerfile \
--tag nuxt-auth-utils-demo_distroless .

docker run --detach \
--name nuxt-auth-utils-demo_distroless \
--publish 3001:3000 \
--memory=100m \
--memory-swap=100m \
--restart unless-stopped \
nuxt-auth-utils-demo_distroless:latest

# BUILD : 多平台，無快取
# docker buildx build
# --platform linux/arm64
# --no-cache
