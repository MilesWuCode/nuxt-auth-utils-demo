ARG NODE_VERSION=26

# Build
FROM node:${NODE_VERSION}-alpine AS build

ARG ENV_FiLE=local.env

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

COPY ./envs/${ENV_FiLE} .env

RUN npm run build

# Run
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
