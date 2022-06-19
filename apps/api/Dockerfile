FROM positivly/prisma-binaries:latest AS prisma
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

RUN pnpm install --offline --shamefully-hoist
RUN pnpm nx build api

ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
    PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
    PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
    PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
    PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
    PRISMA_CLIENT_ENGINE_TYPE=binary
COPY --from=prisma /prisma-engines/query-engine /prisma-engines/migration-engine /prisma-engines/introspection-engine /prisma-engines/prisma-fmt /prisma-engines/

FROM node:lts AS production
RUN apt-get update || : && apt-get install -y \
    openssl

WORKDIR /app
COPY --from=image_builder /app .
RUN npm install -g pnpm

CMD pnpm nx migrate:deploy prisma && pnpm nx start api