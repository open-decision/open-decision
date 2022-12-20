FROM node:16-bullseye-slim as base
RUN apt-get update || : && apt-get install -y \
    python \
    build-essential \
    node-gyp \
    git \
    openssl


# ------------------------------------------------------------------
# Install all node_modules, including dev dependencies
FROM positivly/prisma-binaries:latest as prisma
FROM base as build
ENV NODE_ENV=development

WORKDIR /app

COPY . .
RUN yarn install
RUN yarn setup

RUN yarn dlx nx build api

ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
    PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
    PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
    PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
    PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
    PRISMA_CLIENT_ENGINE_TYPE=binary
COPY --from=prisma /prisma-engines/query-engine /prisma-engines/migration-engine /prisma-engines/introspection-engine /prisma-engines/prisma-fmt /prisma-engines/

# ------------------------------------------------------------------
# Finally, build the production image with minimal footprint
FROM base as prod

EXPOSE 8080
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app .

USER node

CMD ["node", "dist/apps/api/main.js"]
