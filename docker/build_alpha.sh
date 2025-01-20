docker rm -f nuxt-auth-utils-demo
docker rmi nuxt-auth-utils-demo

docker build --no-cache \
--build-arg ENV=alpha.env \
--file ./docker/Dockerfile \
-t nuxt-auth-utils-demo .

docker run --name nuxt-auth-utils-demo -p 3000:3000 \
--restart unless-stopped \
-d nuxt-auth-utils-demo:latest
