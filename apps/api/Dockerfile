FROM node:lts AS image_builder

ENV NODE_ENV development
RUN npm install -g pnpm

WORKDIR /app
RUN apt-get update || : && apt-get install -y \
    python \
    build-essential \
    node-gyp

COPY pnpm-lock.yaml .
RUN pnpm fetch

COPY . .

RUN pnpm install -r --offline
RUN pnpm nx build api

FROM node:lts AS production

WORKDIR /app
COPY --from=image_builder /app .
RUN npm install -g pnpm

CMD pnpm nx migrate:deploy models && pnpm nx start api