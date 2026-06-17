#!/usr/bin/env sh

set -e

docker rm -f nuxt-auth-utils-demo || true
docker rmi nuxt-auth-utils-demo || true

docker build \
--build-arg ENV_FILE=local.env \
--file ./docker/node/Dockerfile \
--tag nuxt-auth-utils-demo .

docker run --detach \
--name nuxt-auth-utils-demo \
--publish 3000:3000 \
--restart unless-stopped \
nuxt-auth-utils-demo:latest

# 多平台，無快取
# docker buildx build
# --platform linux/arm64
# --no-cache
