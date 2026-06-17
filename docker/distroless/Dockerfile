# Build
FROM --platform=$BUILDPLATFORM node:26-alpine AS build

ARG ENV_FILE=local.env

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

COPY ./envs/${ENV_FILE} .env

RUN npm run build

# Run
FROM --platform=$BUILDPLATFORM gcr.io/distroless/nodejs26-debian13

WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD [".output/server/index.mjs"]
